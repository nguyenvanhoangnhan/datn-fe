import { Pause, SkipForwardCircle } from "@phosphor-icons/react"
import { SkipBackCircle } from "@phosphor-icons/react/dist/ssr"
import React, { FC, useCallback, useEffect, useMemo } from "react"

import "./Player.less"
import { PlayMode, usePlayingStore } from "@/store/playing.store"
import PlayIcon from "@/components/SVG/PlayIcon"
import NextIcon from "@/components/SVG/NextIcon"
import PreviousIcon from "@/components/SVG/PreviousIcon"
import RepeatOneIcon from "@/components/SVG/RepeatOneIcon"
import RepeatIcon from "@/components/SVG/RepeatIcon"
import NoRepeatIcon from "@/components/SVG/NoRepeatIcon"
import ShuffleIcon from "@/components/SVG/ShuffleIcon"
import { getPercent, seconds_to_mm_ss } from "@/utils"

export type PlayerProps = {
    audioRef: React.RefObject<HTMLAudioElement>
}

const Player: FC<PlayerProps> = ({ audioRef }) => {
    const store = usePlayingStore()

    const isPlaying = useMemo(() => store.isPLaying, [store.isPLaying])
    const playingItem = useMemo(() => store.playingItem, [store.playingItem])
    const mode = useMemo(() => store.mode, [store.mode])
    const isShuffle = useMemo(() => store.isShuffle, [store.isShuffle])
    const currentTime = useMemo(() => store.currentTime, [store.currentTime])

    const play = useCallback(store.play, [store])
    const pause = useCallback(store.pause, [store])
    const nextMode = useCallback(store.nextMode, [store])
    const shuffleOn = useCallback(store.shuffleOn, [store])
    const shuffleOff = useCallback(store.shuffleOff, [store])

    const toNextTrack = useCallback(() => store.playNextTrack(), [store])
    const toPreviousTrack = useCallback(
        () => store.playPreviousTrack(),
        [store]
    )

    const duration = audioRef.current?.duration

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, audioRef])

    useEffect(() => {
        if (!playingItem) return
        if (isPlaying) {
            audioRef?.current?.play()
        }
    }, [playingItem?.uuid, audioRef, isPlaying])

    useEffect(() => {
        // print all state of store
        console.table({
            isPlaying,
            previousQueue: store.previousQueue
                .map((item) => item?.track?.title)
                .join(" -> "),
            playingItem: store.playingItem?.track?.title,
            nextQueue: store.nextQueue
                .map((item) => item?.track?.title)
                .join(" -> "),
        })
    }, [store])

    return (
        <div className="w-full p-0.5 flex flex-col items-center justify-between">
            <ProgressBar
                currentTime={currentTime}
                duration={duration || 0}
                onChangeProgress={(newValue) => {
                    const newTime = (newValue * (duration || 0)) / 100
                    // store.setCurrentTime(newTime)
                    audioRef.current?.fastSeek(newTime)
                }}
            />
            <div className="py-4 flex-center gap-6">
                <ModeButton mode={mode} onClick={nextMode} />
                <PreviousButton onClick={toPreviousTrack} />
                <PlayPauseButton
                    isPlaying={isPlaying}
                    onPauseClick={pause}
                    onPlayClick={play}
                />
                <NextButton onClick={toNextTrack} />
                <div onClick={isShuffle ? shuffleOff : shuffleOn}>
                    <ShuffleIcon fill={isShuffle ? "white" : "#888"} />
                </div>
            </div>
        </div>
    )
}

const PreviousButton: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <div className="previous_button" onClick={onClick}>
            <PreviousIcon fill="#888" />
        </div>
    )
}

const ModeButton: FC<{ mode: PlayMode; onClick: () => void }> = ({
    mode,
    onClick,
}) => {
    return (
        <div className="mode_button" onClick={onClick}>
            {mode === PlayMode.normal && <NoRepeatIcon fill="#888" />}
            {mode === PlayMode.repeatAll && <RepeatIcon fill="white" />}
            {mode === PlayMode.repeatOne && <RepeatOneIcon fill="white" />}
        </div>
    )
}

const PlayPauseButton: FC<{
    isPlaying: boolean
    onPauseClick: () => void
    onPlayClick: () => void
}> = ({ isPlaying, onPauseClick, onPlayClick }) => {
    return (
        <div
            className="__play-pause-icon bg-ongakool text-white w-16 h-16 flex-center rounded-full"
            onClick={isPlaying ? onPauseClick : onPlayClick}
        >
            {isPlaying ? (
                <Pause weight="fill" size={32} />
            ) : (
                <PlayIcon fill="white" />
            )}
        </div>
    )
}

const NextButton: FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <div className="next_button" onClick={onClick}>
            <NextIcon fill="#888" />
        </div>
    )
}

const ProgressBar: FC<{
    currentTime: number
    duration: number
    onChangeProgress: (newProgress: number) => void
}> = ({ currentTime, duration, onChangeProgress }) => {
    const seekBarRef = React.useRef<HTMLDivElement>(null)

    const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const offset = e.nativeEvent.offsetX
        const width = e.currentTarget.clientWidth

        const _percent = getPercent(offset, width)

        onChangeProgress(_percent)
    }

    return (
        <div className="w-full py-4">
            <div className="w-full text-xs flex justify-between py-2">
                <span>{seconds_to_mm_ss(currentTime)}</span>
                <span>{seconds_to_mm_ss(duration)}</span>
            </div>
            <div
                className="__seek-bar min-w-full bg-gray-700 h-[5px] rounded-3xl cursor-pointer"
                onClick={handleSeekBarClick}
                ref={seekBarRef}
            >
                <div
                    className="w-0 h-full rounded-3xl bg-ongakool"
                    style={{
                        width:
                            currentTime && duration
                                ? `${getPercent(currentTime, duration)}%`
                                : "0%",
                    }}
                ></div>
            </div>
        </div>
    )
}

export default Player
