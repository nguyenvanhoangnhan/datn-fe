import { removeTrackFromPlaylist } from "@/api"
import { Track } from "@/entities"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { IonSpinner } from "@ionic/react"
import { Trash } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import React, { FC } from "react"

type PlaylistDetailTrackItemProps = {
    track?: Track
    playlistId: number
    onDeleted?: () => void
}

const PlaylistDetailTrackItem: FC<PlaylistDetailTrackItemProps> = ({
    track,
    playlistId,
    onDeleted,
}) => {
    if (!track) return null

    const { mutate: removeTrack, isPending } = useMutation({
        mutationKey: ["remove-track-from-playlist", track.id],
        mutationFn: () =>
            removeTrackFromPlaylist(playlistId, track.id).then(() => {
                onDeleted?.()
            }),
    })

    return (
        <>
            <div className="flex justify-between items-center w-full">
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
                            <Trash
                                onClick={() => removeTrack()}
                                className="cursor-pointer"
                                size={20}
                                weight="bold"
                                color="red"
                                opacity={0.75}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isPending && (
                <div className="w-screen h-screen fixed flex-center top-0 left-0 z-[888888] bg-black opacity-30">
                    <IonSpinner name="dots" />
                </div>
            )}
        </>
    )
}

export default PlaylistDetailTrackItem
