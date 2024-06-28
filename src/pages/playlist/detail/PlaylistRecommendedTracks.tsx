import {
    addTrackToPlaylist,
    apiGetRecommendationForPlaylists,
    apiGetTrackById,
} from "@/api"
import { Track } from "@/entities"
import { usePlayingStore } from "@/store/playing.store"
import { mainColor } from "@/theme/constant"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { IonSpinner } from "@ionic/react"
import { PlusCircle } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { FC, useCallback } from "react"

type PlaylistRecommendedTracksProps = {
    playlistId: number
    onAdded?: () => Promise<void>
}

const PlaylistRecommendedTracks: FC<PlaylistRecommendedTracksProps> = ({
    playlistId,
    onAdded,
}) => {
    const playingStore = usePlayingStore()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-playlist-recommended-tracks", playlistId],
        queryFn: () => apiGetRecommendationForPlaylists(playlistId),
    })

    const handleAddToPlaylist = useCallback(async (trackId: number) => {
        await addTrackToPlaylist(playlistId, trackId)
        await refetch({})
        await onAdded?.()
    }, [])

    const handleClick = useCallback(
        async (trackId: number) => {
            await apiGetTrackById(trackId).then((_track) => {
                playingStore.play1Song(_track)
            })
        },
        [apiGetTrackById, playingStore]
    )

    const renderRecommendedSong = useCallback(
        (track: Track) => {
            return (
                <div
                    className="__playlist-recommended__list__item flex gap-4"
                    key={track.id}
                >
                    <div className="w-12 h-12 aspect-square overflow-hidden rounded-sm shrink-0">
                        <img
                            onClick={async () => {
                                handleClick(track.id)
                            }}
                            className="w-full h-full object-cover"
                            src={
                                track?.album?.coverImageUrl ??
                                DEFAULT_ALBUM_COVER
                            }
                        />
                    </div>
                    <div className="__playlist-recommended__list__item__info w-full flex flex-col justify-center flex-1">
                        <p className="text-sm font-semibold m-0 line-clamp-1">
                            {track?.title}
                        </p>
                        <p className="text-xs font-medium line-clamp-1">
                            {track?.artistNames}
                        </p>
                    </div>
                    <div className="flex-center pl-2">
                        <PlusCircle
                            weight="duotone"
                            size={20}
                            color={mainColor}
                            onClick={() => {
                                handleAddToPlaylist(track.id)
                            }}
                        />
                    </div>
                </div>
            )
        },
        [handleAddToPlaylist]
    )

    return (
        <>
            <div className="__playlist-recommended">
                <div className="__playlist-recommended__title mb-4">
                    <h4 className="font-bold mb-0">Recommended</h4>
                    <p className="text-xs">Based on what's in this playlist</p>
                </div>

                <div className="__playlist-recommended__list">
                    {isLoading ? (
                        <div className="w-full h-full mt-4 flex-center">
                            <IonSpinner name="dots" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {data?.slice(0, 5)?.map((track: Track) => {
                                return renderRecommendedSong(track)
                            })}

                            <div className="mt-3 flex-center">
                                <div
                                    className="text-black bg-white px-3 py-2 font-semibold text-xs rounded-full cursor-pointer"
                                    onClick={() => {
                                        refetch({})
                                    }}
                                >
                                    Refresh
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PlaylistRecommendedTracks
