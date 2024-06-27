import { Playlist } from "@/entities"
import { mainColor } from "@/theme/constant"
import { Pencil } from "@phosphor-icons/react"
import { FC, useEffect, useState } from "react"
import PlaylistDetailEditModal from "./PlaylistDetailEditModal"
import { useIonModal } from "@ionic/react"
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces"
import { useMutation } from "@tanstack/react-query"
import { updatePlaylist, updatePlaylistCover } from "@/api"

type PlaylistDetailCoverAndTitleProps = {
    playlistId: number
    name: string
    description: string
    coverImageUrl: string
    onUpdated?: () => void
}

const PlaylistDetailCoverAndTitle: FC<PlaylistDetailCoverAndTitleProps> = ({
    playlistId,
    name,
    description,
    coverImageUrl,
    onUpdated,
}) => {
    const [present, dismiss] = useIonModal(PlaylistDetailEditModal, {
        dismiss: (data: string, role: string) => dismiss(data, role),
        initialName: name,
        initialDescription: description,
    })

    const { mutate: mutateUpdatePlaylist, isPending: mutatingUpdatePlaylist } =
        useMutation({
            mutationKey: ["update-playlist"],
            mutationFn: (data: { name: string; description: string }) =>
                updatePlaylist(playlistId, {
                    name: data.name,
                    description: data.description,
                }).then(() => {
                    onUpdated?.()
                }),
        })

    function openModal() {
        present({
            onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {
                if (ev.detail.role === "confirm") {
                    console.log("onWillDismiss", ev.detail.data)
                    await mutateUpdatePlaylist(ev.detail.data)
                } else {
                    console.log("onWillDismiss", ev.detail.role)
                }
            },
        })
    }

    const { mutate: mutateUpdateCover, isPending: mutateUpdateAvatar } =
        useMutation({
            mutationKey: ["update-playlist-avatar"],
            mutationFn: (file: File) =>
                updatePlaylistCover(playlistId, file).then(() => {
                    onUpdated?.()
                }),
        })

    return (
        <div className="flex flex-col gap-6">
            <div className="__playlist-detail__image relative w-full max-w-64 mx-auto aspect-square overflow-hidden rounded-lg">
                <form>
                    <label
                        htmlFor="upload-avatar"
                        className="absolute top-4 right-4 bg-ongakool bg-opacity-80 p-2 rounded-full cursor-pointer"
                    >
                        <Pencil
                            size={20}
                            color="white"
                            className="cursor-pointer"
                        />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0])
                                mutateUpdateCover(e.target.files?.[0] as File)
                        }}
                        hidden
                        id="upload-avatar"
                    />
                </form>
                <img
                    className="object-cover w-full h-full"
                    src={coverImageUrl}
                />
            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs font-bold">Playlist</span>
                    <span className="font-bold text-2xl flex gap-2 items-center">
                        {name}
                    </span>
                    <span className="text-xs italic text-gray-300 line-clamp-3">
                        {!description || description === ""
                            ? "<No description>"
                            : description}
                    </span>
                </div>
                <div>
                    {playlistId !== -1 && (
                        <Pencil
                            size={20}
                            color={mainColor}
                            className="cursor-pointer"
                            onClick={openModal}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlaylistDetailCoverAndTitle
