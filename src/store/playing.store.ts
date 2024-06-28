import { Track } from "@/entities"
import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import { dislikeTrack, likeTrack } from "@/api"

type QueueItem = {
    track: Track
    order: number
    uuid: string
}

export enum PlayMode {
    repeatOne = "repeat-one",
    repeatAll = "repeat-all",
    normal = "normal",
}

interface PlayingState {
    isPLaying: boolean
    isOpenPlaying: boolean
    playingItem?: QueueItem
    currentTime: number
    nextQueue: QueueItem[]
    previousQueue: QueueItem[]
    contextList: Track[]
    mode: PlayMode
    isShuffle: boolean
}

interface PlayingAction {
    play: () => void
    pause: () => void
    setPlayingItem: (playingItem: QueueItem) => void
    openPlaying: () => void
    closePlaying: () => void
    likePlayingTrack: () => void
    dislikePlayingTrack: () => void
    playNextTrack: () => void
    playPreviousTrack: () => void
    shuffleOn: () => void
    shuffleOff: () => void
    nextMode: () => void
    setCurrentTime: (currentTime: number) => void
    autoPlayNextTrack: () => void

    play1Song: (track: Track) => void
    playAlbumOrPlayList: (tracks: Track[], fromIndex?: number) => void
}

export const usePlayingStore = create<PlayingState & PlayingAction>(
    (set, get) => ({
        isPLaying: false,
        isOpenPlaying: false,
        currentTime: 0,
        playingItem: undefined,
        nextQueue: [],
        previousQueue: [],
        contextList: [],
        mode: PlayMode.normal,
        isShuffle: false,
        play: () => {
            if (!get().playingItem) return
            set({ isPLaying: true })
        },
        pause: () => set({ isPLaying: false }),
        setPlayingItem: (playingItem: QueueItem) => set({ playingItem }),
        openPlaying: () => set({ isOpenPlaying: true }),
        closePlaying: () => set({ isOpenPlaying: false }),
        likePlayingTrack: () => {
            const playingItem = get().playingItem
            if (!playingItem) return
            set({
                playingItem: {
                    ...playingItem,
                    track: {
                        ...playingItem.track,
                        isFavourite: 1,
                    },
                },
            })
            likeTrack(playingItem.track.id)
        },
        dislikePlayingTrack: () => {
            const playingItem = get().playingItem
            if (!playingItem) return
            set({
                playingItem: {
                    ...playingItem,
                    track: {
                        ...playingItem.track,
                        isFavourite: 0,
                    },
                },
            })
            dislikeTrack(playingItem.track.id)
        },
        playNextTrack: () => {
            const mode = get().mode
            const playingItem = get().playingItem
            let nextQueue = get().nextQueue
            let previousQueue = get().previousQueue

            if (!playingItem) return

            if (nextQueue.length === 0) {
                if (mode === PlayMode.repeatOne) {
                    set({
                        playingItem: {
                            ...playingItem,
                            uuid: uuidv4(),
                        },
                        isPLaying: true,
                    })
                    return
                }

                if (mode === PlayMode.repeatAll) {
                    const { contextList, isShuffle } = get()
                    const newNextQueue = contextList.map((track, index) => ({
                        track,
                        order: index + 1,
                        uuid: uuidv4(),
                    }))

                    if (isShuffle) {
                        newNextQueue.sort(() => Math.random() - 0.5)
                    }

                    const nextItem = newNextQueue.shift()
                    previousQueue.push(playingItem)

                    set({
                        playingItem: nextItem,
                        nextQueue: newNextQueue,
                        previousQueue,
                        isPLaying: true,
                    })

                    return
                }

                previousQueue.push(playingItem)
                set({
                    playingItem: undefined,
                    previousQueue,
                    isPLaying: false,
                })
                return
            }

            const nextItem = nextQueue.shift()
            previousQueue.push(playingItem)
            set({
                playingItem: nextItem,
                nextQueue,
                previousQueue,
                isPLaying: true,
            })
        },
        playPreviousTrack: () => {
            const mode = get().mode
            const playingItem = get().playingItem
            let nextQueue = get().nextQueue
            let previousQueue = get().previousQueue

            if (previousQueue.length === 0) {
                if (mode === PlayMode.repeatAll) {
                    const lastItem = nextQueue.pop()
                    if (playingItem) previousQueue.unshift(playingItem)
                    set({
                        playingItem: lastItem,
                        nextQueue,
                        previousQueue,
                        isPLaying: true,
                    })
                }

                return
            }

            const previousItem = previousQueue.pop()
            if (playingItem) nextQueue.unshift(playingItem)
            set({
                playingItem: previousItem,
                nextQueue,
                previousQueue,
                isPLaying: true,
            })
        },
        shuffleOn: () => {
            const isShuffle = get().isShuffle
            if (isShuffle) return

            const nextQueue = get().nextQueue

            const newQueue = nextQueue.sort(() => Math.random() - 0.5)

            set({
                isShuffle: true,
                nextQueue: newQueue,
            })
        },
        shuffleOff: () => {
            const isShuffle = get().isShuffle
            if (!isShuffle) return

            const nextQueue = get().nextQueue

            const newQueue = nextQueue.sort((a, b) => a.order - b.order)

            set({
                isShuffle: false,
                nextQueue: newQueue,
            })
        },
        nextMode: () => {
            const mode = get().mode
            let newMode: PlayMode

            switch (mode) {
                case PlayMode.normal:
                    newMode = PlayMode.repeatAll
                    break
                case PlayMode.repeatAll:
                    newMode = PlayMode.repeatOne
                    break
                case PlayMode.repeatOne:
                    newMode = PlayMode.normal
                    break
            }

            set({ mode: newMode })
        },

        autoPlayNextTrack: () => {
            // if repeat one ==> play again
            const mode = get().mode
            const playingItem = get().playingItem
            if (mode === PlayMode.repeatOne) {
                if (!playingItem) {
                    return
                }

                set({
                    playingItem: {
                        ...playingItem,
                        uuid: uuidv4(),
                    },
                    isPLaying: true,
                })
                return
            }

            get().playNextTrack()
        },
        setCurrentTime: (currentTime: number) => set({ currentTime }),

        play1Song: (track: Track) => {
            const playingItem = {
                track,
                order: 1,
                uuid: uuidv4(),
            }

            set({
                contextList: [track],
                mode: PlayMode.repeatOne,
                playingItem,
                nextQueue: [],
                previousQueue: [],
                isPLaying: true,
                isOpenPlaying: true,
            })
        },

        playAlbumOrPlayList: (tracks: Track[], fromIndex?: number) => {
            console.log("tracks", tracks)

            if (fromIndex !== undefined) {
                const _tracks = tracks.slice(fromIndex)

                const playingItem = {
                    track: _tracks[0],
                    order: 1,
                    uuid: uuidv4(),
                }

                const nextQueue = _tracks.slice(1).map((track, index) => ({
                    track,
                    order: index + 2,
                    uuid: uuidv4(),
                }))

                set({
                    contextList: tracks,
                    mode: PlayMode.repeatAll,
                    playingItem,
                    nextQueue,
                    previousQueue: [],
                    isPLaying: true,
                    isOpenPlaying: true,
                })

                return
            }

            const playingItem = {
                track: tracks[0],
                order: 1,
                uuid: uuidv4(),
            }

            const nextQueue = tracks.slice(1).map((track, index) => ({
                track,
                order: index + 2,
                uuid: uuidv4(),
            }))

            set({
                contextList: tracks,
                mode: PlayMode.repeatAll,
                playingItem,
                nextQueue,
                previousQueue: [],
                isPLaying: true,
                isOpenPlaying: true,
            })
        },
    })
)
