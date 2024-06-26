import { usePlayingStore } from "@/store/playing.store"
import { FC, useCallback, useMemo, useRef } from "react"
import Player from "./Player"

export type AudioPlayerProps = {}

const AudioPlayer: FC<AudioPlayerProps> = () => {
    const store = usePlayingStore()

    const isPlaying = useMemo(() => store.isPLaying, [store.isPLaying])
    const playingTrack = useMemo(
        () => store.playingItem?.track,
        [store.playingItem?.uuid]
    )
    const setCurrentTime = useCallback(store.setCurrentTime, [store])

    const audioElementRef = useRef<HTMLAudioElement>(null)

    const onPlaying = () => {
        const duration = audioElementRef.current?.duration
        const currentTime = audioElementRef.current?.currentTime

        if (!duration || !currentTime) return

        setCurrentTime(currentTime)

        if (duration === currentTime) {
            store.autoPlayNextTrack()
        }
    }

    return (
        <>
            <audio
                src={playingTrack?.audio?.fullUrl}
                ref={audioElementRef}
                onTimeUpdate={() => onPlaying()}
            />
            <Player audioRef={audioElementRef} />
        </>
    )
}

export default AudioPlayer
