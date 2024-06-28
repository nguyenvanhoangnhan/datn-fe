import { apiGetAlbumById } from "@/api"
import { IonSpinner } from "@ionic/react"
import { ArrowRight } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { RouteComponentProps, useHistory } from "react-router"
import AlbumDetailHeader from "./AlbumDetailHeader"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import AlbumDetailsTrackItem from "./TrackItem"
import AlbumDetailCoverAndTitle from "./CoverAndTitle"
import { PlayPauseButton } from "@/components/Specific/Playing/Player"
import { usePlayingStore } from "@/store/playing.store"
import { isEqual } from "lodash"
import { Track } from "@/entities"

export interface AlbumDetailProps
    extends RouteComponentProps<{
        albumId: string
    }> {}

const AlbumDetail: FC<AlbumDetailProps> = ({ match }) => {
    const albumId = match.params?.albumId

    const history = useHistory()
    const playStore = usePlayingStore()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-album-details", albumId],
        queryFn: () => apiGetAlbumById(albumId === "-1" ? -1 : +albumId),
    })

    return (
        <div
            className="__playlist-detail pt-12 px-2 w-screen flex flex-col h-full
            overflow-y-scroll bg-black z-[88]
        "
        >
            <AlbumDetailHeader
                title={isLoading ? "Loading..." : "Album Detail"}
            />

            <div className="w-full h-full mt-2">
                {isLoading ? (
                    <div className="w-full h-full flex-center">
                        <IonSpinner name="dots" />
                    </div>
                ) : (
                    data && (
                        <div className="h-full flex flex-col gap-6 overflow-y-scroll px-4 pb-32">
                            <AlbumDetailCoverAndTitle
                                name={data.title}
                                coverImageUrl={
                                    data.coverImageUrl ?? DEFAULT_ALBUM_COVER
                                }
                            />
                            <div className="flex-center">
                                <PlayPauseButton
                                    isPlaying={playStore.isPLaying}
                                    onPlayClick={() => {
                                        // compare playStore.contextList with data.playlist_track_links.map(item => item.track)
                                        const isPlayingThisPlaylist = isEqual(
                                            playStore.contextList.map(
                                                (i) => i.id
                                            ),
                                            data?.tracks?.map((i) => i?.id)
                                        )

                                        if (!isPlayingThisPlaylist) {
                                            if (!data.tracks) return
                                            const tracks = data.tracks
                                            playStore.playAlbumOrPlayList(
                                                tracks
                                            )
                                        } else if (playStore.isPLaying) {
                                            playStore.pause()
                                        } else {
                                            playStore.openPlaying()
                                            playStore.play()
                                        }
                                    }}
                                    onPauseClick={() => {
                                        playStore.pause()
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                {data?.tracks?.map((item, index) => {
                                    return (
                                        <AlbumDetailsTrackItem
                                            track={item}
                                            key={item.id}
                                            onClick={() => {
                                                playStore.playAlbumOrPlayList(
                                                    data?.tracks as Track[],
                                                    index
                                                )
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default AlbumDetail
