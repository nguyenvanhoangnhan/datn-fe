import { apiTrackListenToTrack } from "@/api"
import { usePlayingStore } from "@/store/playing.store"
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react"

export type AudioProps = {
    audioElementRef: React.RefObject<HTMLAudioElement>
}

const Audio: FC<AudioProps> = ({ audioElementRef }) => {
    const store = usePlayingStore()

    const isPlaying = useMemo(() => store.isPLaying, [store.isPLaying])
    const playingTrack = useMemo(
        () => store.playingItem?.track,
        [store.playingItem?.uuid]
    )
    const setCurrentTime = useCallback(store.setCurrentTime, [store])

    const tracked = useRef(false)

    useEffect(() => {
        console.log("Change audio playing track", playingTrack?.title)
        console.log("Change audio:", playingTrack?.audio?.fullUrl)
        tracked.current = false
    }, [playingTrack])

    const onPlaying = () => {
        const duration = audioElementRef.current?.duration
        const currentTime = audioElementRef.current?.currentTime

        if (!duration || !currentTime) return

        setCurrentTime(currentTime)

        if (currentTime > duration / 8 && !tracked.current) {
            if (playingTrack?.id) {
                tracked.current = true
                apiTrackListenToTrack(playingTrack.id)
            }
        }

        if (duration === currentTime) {
            store.autoPlayNextTrack()
        }
    }

    return (
        <audio
            src={playingTrack?.audio?.fullUrl}
            ref={audioElementRef}
            onTimeUpdate={() => onPlaying()}
        />
    )
}

export default Audio
