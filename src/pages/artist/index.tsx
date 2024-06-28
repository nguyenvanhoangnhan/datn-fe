import {
    addTrackToPlaylist,
    apiGetArtistById,
    apiGetSimilarArtists,
} from "@/api"
import { Album, Artist, Track } from "@/entities"
import { mainColor } from "@/theme/constant"
import { DEFAULT_ALBUM_COVER, DEFAULT_AVATAR } from "@/utils"
import {
    IonContent,
    IonItem,
    IonList,
    IonPage,
    IonPopover,
    IonSpinner,
    useIonModal,
    useIonToast,
} from "@ionic/react"
import { CaretLeft, DotsThree, SignOut } from "@phosphor-icons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import React, { FC, useEffect, useRef } from "react"
import { RouteComponentProps, useHistory } from "react-router"
import logout from "../logout"
import AddToPlaylistModal from "@/components/AddToPlaylistModal"
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces"
import { ArtistAlbumTrackItem } from "../home/ArtistAlbumTracks"
import { usePlayingStore } from "@/store/playing.store"

export interface ArtistPageProps
    extends RouteComponentProps<{
        artistId: string
    }> {}

const ArtistPage: FC<ArtistPageProps> = ({ match }) => {
    const artistId = match.params?.artistId
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // scroll to header
        scrollTo(0, 0)
    }, [])

    const history = useHistory()

    const {
        data: artist,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["get-artist-details", artistId],
        queryFn: () => apiGetArtistById(artistId),
    })

    if (isLoading) {
        return (
            <div className="flex-center w-full h-full">
                <span>Loading...</span>
            </div>
        )
    }

    if (!artist) {
        history.push("/home")
        return null
    }

    return (
        <div
            ref={ref}
            id="__artist_page"
            className="relative flex flex-col w-full h-screen overflow-y-scroll bg-black z-[88]"
        >
            <Header artist={artist} />
            <div className="py-12 pt-14 p-10 gap-8">
                <ArtistAlbums albums={artist?.albums ?? []} />
                <ArtistTracks tracks={artist?.tracks ?? []} />
                <SimilarArtists artistId={+artistId} />
            </div>
        </div>
    )
}

type HeaderProps = {
    artist: Artist
}

const Header: FC<HeaderProps> = ({ artist }) => {
    const history = useHistory()

    const handleBack = () => {
        history.goBack()
    }

    return (
        <div className="__playing shadow-none flex flex-col relative w-full">
            <div
                onClick={handleBack}
                className="
                fixed left-4 top-8 z-[30]
                p-[7px] bg-opacity-40 bg-black border border-[#333333] rounded-full inline-flex cursor-pointer"
                style={{
                    boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.2)",
                }}
            >
                <CaretLeft color="white" size={16} weight="bold" />
            </div>
            <span className="w-full h-72 bg-[#333] rounded-b-[48px] overflow-hidden relative">
                {artist.avatarImageUrl && (
                    <img
                        src={artist.avatarImageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                )}
                <div className="w-full h-full bg-black absolute top-0 left-0 bg-opacity-40"></div>
                <span className="absolute bottom-12 pl-8 font-bold text-xl">
                    {artist.name}
                </span>
            </span>
            <div className="mt-8 flex-col-center w-full">
                <span className="text-xs font-medium">Monthly listeners: </span>
                <span className="text-lg font-semibold">
                    {artist.temp_popularity?.toLocaleString() ?? "Unknown"}
                </span>
            </div>
        </div>
    )
}

type ArtistAlbumsProps = {
    albums?: Album[]
}

const ArtistAlbums: FC<ArtistAlbumsProps> = ({ albums }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-2">Albums</h2>
            <div className="relative w-full overflow-x-scroll mb-8 group flex gap-4">
                {albums?.map((album, index) => {
                    return <SingleAlbum key={album.id} album={album} />
                })}
            </div>
        </div>
    )
}

type SingleAlbumProps = {
    album: Album
}

const SingleAlbum: FC<SingleAlbumProps> = ({ album }) => {
    const history = useHistory()

    const handleClick = async () => {
        history.push(`/home/album/${album?.id}`)
    }

    return (
        <div className="flex flex-shrink-0 flex-col" onClick={handleClick}>
            <div className="w-36 overflow-hidden rounded-xl relative">
                <img
                    className="w-full"
                    src={album?.coverImageUrl ?? ""}
                    alt=""
                />
                {/* <div className="absolute right-3 bottom-3">
                    <SmallPlay />
                </div> */}
            </div>
            <div className="flex flex-col w-36 py-1">
                <span className="font-bold text-xs line-clamp-1 overflow-ellipsis  text-center">
                    {album?.title}
                </span>
                <span className="font-medium text-xs line-clamp-1 text-center">
                    {album?.releasedAt?.toString()?.slice(0, 4) ?? "Unknown"}
                </span>
            </div>

            {/* {loading && (
                <div className="w-screen h-screen fixed flex-center top-0 left-0 z-[888888] bg-black opacity-30">
                    <IonSpinner name="dots" />
                </div>
            )} */}
        </div>
    )
}

type ArtistTracksProps = {
    tracks?: Track[]
}

const ArtistTracks: FC<ArtistTracksProps> = ({ tracks }) => {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-2">Popular Songs</h2>
            <div className="flex flex-col gap-4 w-full">
                {tracks?.slice(0, 5)?.map((track, index) => {
                    return <ArtistTrackItem key={track.id} track={track} />
                })}
            </div>
        </div>
    )
}

type ArtistTrackItemProps = {
    track?: Track
}

const ArtistTrackItem: FC<ArtistTrackItemProps> = ({ track }) => {
    const [presentToast] = useIonToast()
    const [presentModal, dismiss] = useIonModal(AddToPlaylistModal, {
        dismiss: (data: string, role: string) => dismiss(data, role),
    })

    const playStore = usePlayingStore()

    const { mutate: mutateAddTrackToPlaylist } = useMutation({
        mutationKey: ["add-track-to-playlist", track?.id],
        mutationFn: async (data: { playlistId: number }) => {
            if (!track) return
            await addTrackToPlaylist(data.playlistId, track?.id)
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

    if (!track) return null

    return (
        <div
            className="flex justify-between items-center w-full"
            onClick={() => {
                playStore.play1Song(track)
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
                        <DotsThree
                            weight="bold"
                            id={`more-action-artist-track-${track.id}`}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        />
                        <IonPopover
                            trigger={`more-action-artist-track-${track.id}`}
                            dismissOnSelect={true}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            <IonContent>
                                <IonList>
                                    <IonItem
                                        button={true}
                                        detail={false}
                                        onClick={openModal}
                                        className="text-white flex gap-2 font-semibold text-sm"
                                    >
                                        Add to playlist
                                    </IonItem>
                                </IonList>
                            </IonContent>
                        </IonPopover>
                    </div>
                </div>
            </div>
        </div>
    )
}

type SimilarArtistsProps = {
    artistId: number
}

const SimilarArtists: FC<SimilarArtistsProps> = ({ artistId }) => {
    const { data: similarArtists, isLoading } = useQuery({
        queryKey: ["get-similar-artists"],
        queryFn: () => apiGetSimilarArtists(artistId),
    })

    const history = useHistory()
    const handleArtistClick = (artistId?: number) => {
        if (!artistId) return

        document.getElementById("__artist_page")?.scroll(0, 0)

        history.push(`/home/artist/${artistId}`)
    }

    if (isLoading) {
        return (
            <div className="w-full h-16 flex-center">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!similarArtists) {
        return (
            <div className="w-full h-16 flex-center text-xl font-bold">
                No Data
            </div>
        )
    }

    return (
        <div className="my-8">
            <h2 className="text-xl font-bold mb-2">Similar Artists</h2>
            <div className="w-full flex flex-col gap-4 pt-2">
                {similarArtists.slice(0, 5).map((artist) => (
                    <ArtistAlbumTrackItem
                        key={artist.id}
                        image={artist.avatarImageUrl ?? DEFAULT_AVATAR}
                        primaryText={artist.name}
                        secondaryText={`${artist.temp_popularity.toLocaleString()} monthly listeners`}
                        onClick={() => handleArtistClick(artist?.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ArtistPage
