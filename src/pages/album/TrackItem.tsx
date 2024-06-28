import { removeTrackFromPlaylist } from "@/api"
import { Track } from "@/entities"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { IonSpinner } from "@ionic/react"
import { Trash } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import React, { FC } from "react"

type AlbumDetailsTrackItemProps = {
    track?: Track
    onClick?: () => void
}

const AlbumDetailsTrackItem: FC<AlbumDetailsTrackItemProps> = ({
    track,
    onClick,
}) => {
    if (!track) return null

    return (
        <>
            <div
                className="flex justify-between items-center w-full"
                onClick={() => {
                    onClick?.()
                }}
            >
                <div className="flex items-center gap-2 w-full">
                    <img
                        className="w-12 h-12 rounded-sm"
                        src={track?.album?.coverImageUrl ?? DEFAULT_ALBUM_COVER}
                    />
                    <div className="flex w-full">
                        <div className="flex flex-col justify-between flex-1">
                            <span className="font-semibold text-sm line-clamp-1">
                                {track?.title}
                            </span>
                            <span className="text-xs font-medium text-gray-300 line-clamp-1">
                                {track?.artistNames}
                            </span>
                        </div>
                        <div className="w-12 flex items-center justify-end justify-self-end">
                            ...
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AlbumDetailsTrackItem
