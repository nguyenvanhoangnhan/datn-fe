import { Track } from "@/entities"
import { create } from "zustand"
import {
    mockTrack1,
    mockTrack2,
    mockTrack3,
    mockTrack4,
    mockTrack5,
    mockTrack6,
} from "./mock"
import { v4 as uuidv4 } from "uuid"
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
}

export const usePlayingStore = create<PlayingState & PlayingAction>(
    (set, get) => ({
        isPLaying: false,
        isOpenPlaying: false,
        currentTime: 0,
        playingItem: {
            track: mockTrack1,
            order: 1,
            uuid: "uuid-1",
        },
        nextQueue: [
            {
                track: mockTrack2,
                order: 2,
                uuid: "uuid-2",
            },
            {
                track: mockTrack3,
                order: 3,
                uuid: "uuid-3",
            },
            {
                track: mockTrack4,
                order: 4,
                uuid: "uuid-4",
            },
            {
                track: mockTrack5,
                order: 5,
                uuid: "uuid-5",
            },
            {
                track: mockTrack6,
                order: 6,
                uuid: "uuid-6",
            },
        ],
        previousQueue: [],
        contextList: [mockTrack1, mockTrack2, mockTrack3, mockTrack4],
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
        },
        playNextTrack: () => {
            const mode = get().mode
            const playingItem = get().playingItem
            let nextQueue = get().nextQueue
            let previousQueue = get().previousQueue

            if (!playingItem) return

            if (nextQueue.length === 0) {
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
    })
)
