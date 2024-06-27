import { usePlayingStore } from "@/store/playing.store"
import { CaretDown, CaretLeft, CaretUp } from "@phosphor-icons/react"
import React, { FC, useMemo } from "react"
import Player from "../Player"
import { DEFAULT_AVATAR } from "@/utils"

export type LyricsProps = {
    audioRef: React.RefObject<HTMLAudioElement>
    onCancel: () => void
}

const Lyrics: FC<LyricsProps> = ({ audioRef, onCancel }) => {
    const playingStore = usePlayingStore()

    const playingTrack = useMemo(
        () => playingStore.playingItem?.track,
        [playingStore.playingItem?.track?.id]
    )

    if (!playingTrack) return null

    return (
        <div className="__lyrics w-screen h-screen flex flex-col">
            <div className="bg-[#161616] flex flex-col pt-14 px-10 overflow-hidden flex-1">
                <LyricsHeader onCancelClick={onCancel} />
                <div
                    className="mt-4 py-4 overflow-y-scroll h-full"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    {playingTrack?.lyrics?.content ? (
                        playingTrack?.lyrics?.content
                            ?.split("\n")
                            .map((line, index) => (
                                <p
                                    key={index}
                                    className="text-[#ddd] mb-2 font-bold"
                                >
                                    {line}
                                </p>
                            ))
                    ) : (
                        <div className="w-full h-full flex-center">
                            No lyrics found for this track
                        </div>
                    )}
                </div>
            </div>
            <div className="px-10 pt-6 pb-8 bg-[#333] justify-self-end">
                <div className="track-info flex gap-4 mb-4">
                    <img
                        className="artist-avatar w-12 h-12 rounded-full"
                        src={
                            playingTrack?.mainArtist?.avatarImageUrl ??
                            DEFAULT_AVATAR
                        }
                    />
                    <div className="flex-col">
                        <span
                            className="line-clamp-1 cursor-pointer overflow-ellipsis font-bold"
                            onClick={onCancel}
                        >
                            {playingTrack.title}
                        </span>
                        <span>{playingTrack.mainArtist?.name}</span>
                    </div>
                </div>
                <Player audioRef={audioRef} mini />
            </div>
        </div>
    )
}

export default Lyrics

type LyricsHeaderProps = {
    onCancelClick: () => void
}

const LyricsHeader: FC<LyricsHeaderProps> = ({ onCancelClick }) => {
    return (
        <div className="__playing shadow-none flex-center relative w-full">
            <div
                onClick={onCancelClick}
                className="
                absolute left-0
                p-[7px] bg-opacity-40 bg-black border border-[#333333] rounded-full inline-flex"
                style={{
                    boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.2)",
                }}
            >
                <CaretDown
                    color="white"
                    size={16}
                    weight="bold"
                    className="cursor-pointer"
                />
            </div>
            <span className="font-bold text-lg text-gray-200">Lyrics</span>
        </div>
    )
}
