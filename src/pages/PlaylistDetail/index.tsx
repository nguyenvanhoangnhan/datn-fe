import { getPlaylistDetail } from "@/api"
import { IonSpinner } from "@ionic/react"
import { ArrowRight } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { RouteComponentProps, useHistory } from "react-router"
import PlaylistDetailHeader from "./PlaylistDetailHeader"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import PlaylistDetailTrackItem from "./TrackItem"
import PlaylistDetailCoverAndTitle from "./CoverAndTitle"
import PlaylistRecommendedTracks from "./PlaylistRecommendedTracks"

export interface PlaylistDetailProps
    extends RouteComponentProps<{
        playlistId: string
    }> {}

const PlaylistDetail: FC<PlaylistDetailProps> = ({ match }) => {
    const playlistId = match.params?.playlistId

    const history = useHistory()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-playlist-details", playlistId],
        queryFn: () =>
            getPlaylistDetail(playlistId === "-1" ? -1 : +playlistId),
    })

    return (
        <div className="__playlist-detail pt-12 px-2 w-screen flex flex-col h-full">
            <PlaylistDetailHeader
                title={isLoading ? "Loading..." : "Playlist Detail"}
            />

            <div className="w-full h-full mt-2">
                {isLoading ? (
                    <div className="w-full h-full flex-center">
                        <IonSpinner name="dots" />
                    </div>
                ) : (
                    data && (
                        <div className="h-full flex flex-col gap-6 overflow-y-scroll px-4 pb-32">
                            <PlaylistDetailCoverAndTitle
                                playlistId={data.id}
                                name={data.name}
                                description={data.description ?? ""}
                                coverImageUrl={
                                    data.coverImageUrl ?? DEFAULT_ALBUM_COVER
                                }
                                onUpdated={() => refetch({})}
                            />
                            <div className="flex flex-col gap-4 w-full">
                                {data?.playlist_track_links?.map((item) => {
                                    return (
                                        <PlaylistDetailTrackItem
                                            track={item.track}
                                            playlistId={data.id}
                                            key={item.id}
                                            onDeleted={() => refetch({})}
                                        />
                                    )
                                })}
                                {!data?.playlist_track_links?.length && (
                                    <div className="flex-col-center gap-2">
                                        <span className="italic">
                                            (There is no song yet)
                                        </span>
                                        <div
                                            className="flex-center gap-1 cursor-pointer text-ongakool"
                                            onClick={() => {
                                                history.push(`/home`)
                                            }}
                                        >
                                            <ArrowRight /> Explore songs
                                        </div>
                                    </div>
                                )}
                                {!!data?.playlist_track_links?.length && (
                                    <PlaylistRecommendedTracks
                                        playlistId={data.id}
                                    />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default PlaylistDetail
