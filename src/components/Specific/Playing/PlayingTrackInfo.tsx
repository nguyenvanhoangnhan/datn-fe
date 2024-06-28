import { addTrackToPlaylist } from "@/api"
import AddToPlaylistModal from "@/components/AddToPlaylistModal"
import { Track } from "@/entities"
import { usePlayingStore } from "@/store/playing.store"
import { mainColor } from "@/theme/constant"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { useIonModal, useIonToast } from "@ionic/react"
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces"
import { Heart, PlusCircle } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { FC, useMemo, useCallback } from "react"

type PlayingTrackInfoProps = {
    track?: Track
}

const PlayingTrackInfo: FC<PlayingTrackInfoProps> = () => {
    const store = usePlayingStore()
    const track = useMemo(
        () => store.playingItem?.track,
        [store.playingItem?.track]
    )
    const likePlayingTrack = useCallback(store.likePlayingTrack, [store])
    const dislikePlayingTrack = useCallback(store.dislikePlayingTrack, [store])

    const coverImageUrl = useMemo(() => {
        if (!track?.album?.coverImageUrl) return DEFAULT_ALBUM_COVER

        return track.album.coverImageUrl
    }, [track?.album?.coverImageUrl])

    const { mutate: mutateAddTrackToPlaylist } = useMutation({
        mutationKey: ["add-track-to-playlist", track?.id],
        mutationFn: async (data: { playlistId: number }) => {
            if (!track) return null
            await addTrackToPlaylist(data.playlistId, track.id)
        },
        onSuccess: () => {
            presentToast({
                message: "Added to playlist",
                duration: 2000,
                position: "bottom",
                color: "success",
            })
        },
        onError: (error) => {
            presentToast({
                message: error.message,
                duration: 2000,
                position: "bottom",
                color: "danger",
            })
        },
    })

    const [presentToast] = useIonToast()
    const [presentModal, dismiss] = useIonModal(AddToPlaylistModal, {
        dismiss: (data: string, role: string) => dismiss(data, role),
    })

    function openModal() {
        presentModal({
            onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {
                if (ev.detail.role === "add") {
                    console.log("onWillDismiss", ev.detail.data)
                    await mutateAddTrackToPlaylist(ev.detail.data)
                } else {
                    console.log("onWillDismiss", ev.detail.role)
                }
            },
        })
    }

    if (!track) {
        return (
            <div className="playing__info--no-track flex-col-center w-full flex-1 gap-4">
                No playing track right now
            </div>
        )
    }

    return (
        <div className="playing__info flex-col-center flex-1 gap-4 w-full">
            <img
                src={coverImageUrl}
                className="playing__info__album-cover rounded-lg"
                onClick={() => console.log("Hello")}
            />
            <div className="flex  justify-between w-full">
                <div
                    className="playing__info__text flex flex-col"
                    style={{
                        width: "calc(100% - 40px)",
                    }}
                >
                    <div className="relative flex w-full">
                        <span className="text-xl font-extrabold overflow-ellipsis line-clamp-1">
                            {track.title}
                        </span>
                    </div>
                    <span className="text-md font-medium overflow-ellipsis line-clamp-1">
                        {track?.artistNames}
                    </span>
                </div>
            </div>
            <div className="playing__info__favourite flex gap-8 justify-end">
                <PlusCircle
                    onClick={openModal}
                    className="cursor-pointer"
                    weight="regular"
                    color={mainColor}
                    size={30}
                />
                <Heart
                    onClick={
                        track.isFavourite
                            ? dislikePlayingTrack
                            : likePlayingTrack
                    }
                    className="cursor-pointer"
                    weight={track.isFavourite ? "fill" : "duotone"}
                    color={mainColor}
                    size={30}
                />
            </div>
        </div>
    )
}

export default PlayingTrackInfo
