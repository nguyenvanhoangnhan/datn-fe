import { apiGetRecommendationForPlaylists } from "@/api"
import { Track } from "@/entities"
import { mainColor } from "@/theme/constant"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { IonSpinner } from "@ionic/react"
import { PlusCircle } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { FC } from "react"

type PlaylistRecommendedTracksProps = {
    playlistId: number
}

const PlaylistRecommendedTracks: FC<PlaylistRecommendedTracksProps> = ({
    playlistId,
}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-playlist-recommended-tracks", playlistId],
        queryFn: () => apiGetRecommendationForPlaylists(playlistId),
    })

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
                                return (
                                    <div
                                        className="__playlist-recommended__list__item flex gap-4"
                                        key={track.id}
                                    >
                                        <div className="w-12 h-12 aspect-square overflow-hidden rounded-sm shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={
                                                    track?.album
                                                        ?.coverImageUrl ??
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
                                            />
                                        </div>
                                    </div>
                                )
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
