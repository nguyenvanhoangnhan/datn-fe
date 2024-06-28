import {
    IonLabel,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonToggle,
} from "@ionic/react"
import { FC, useCallback, useState } from "react"
import { CaretLeft } from "@phosphor-icons/react"
import { useHistory } from "react-router"
import { Track, Artist, Album } from "@/entities"
import { useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import {
    apiGetTrackById,
    apiSearchAlbumByName,
    apiSearchArtistByName,
    apiSearchTrackByLyrics,
    apiSearchTrackByTitle,
} from "@/api"
import { ArtistAlbumTrackItem } from "../home/ArtistAlbumTracks"
import { DEFAULT_ALBUM_COVER, DEFAULT_AVATAR } from "@/utils"
import { usePlayingStore } from "@/store/playing.store"

export type SearchProps = {
    // Define your props here if needed
}

enum SegmentEnum {
    Artist = "artist",
    Album = "album",
    Track = "track",
}

const Search: FC<SearchProps> = ({}) => {
    const [segment, setSegment] = useState<SegmentEnum>(SegmentEnum.Artist)
    const [search, setSearch] = useState<string>("")
    const history = useHistory()

    const handleInput = (ev: Event) => {
        let query = ""
        const target = ev.target as HTMLIonSearchbarElement
        if (target) query = target.value!.toLowerCase()

        setSearch(query)
    }

    return (
        <div className="relative flex flex-col w-full h-screen overflow-y-scroll bg-black z-[88]">
            <div className="flex-center w-full">
                <div
                    onClick={() => history.push("/home")}
                    className="py-2 px-4 mt-12 bg-opacity-40 bg-black border border-[#333333] rounded-full inline-flex gap-2 items-center jusify-center"
                    style={{
                        boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.2)",
                    }}
                >
                    <CaretLeft
                        color="white"
                        size={16}
                        weight="bold"
                        className="cursor-pointer"
                    />
                    Back
                </div>
            </div>

            <div>
                <IonSearchbar
                    value={search}
                    onIonInput={(ev) => handleInput(ev)}
                    debounce={500}
                />

                <IonSegment
                    value={segment}
                    onIonChange={(e) =>
                        setSegment(e.detail.value as SegmentEnum)
                    }
                >
                    <IonSegmentButton value={SegmentEnum.Artist}>
                        <IonLabel>Artists</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value={SegmentEnum.Album}>
                        <IonLabel>Albums</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value={SegmentEnum.Track}>
                        <IonLabel>Tracks</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                {segment === SegmentEnum.Artist && (
                    <SearchArtist search={search} />
                )}
                {segment === SegmentEnum.Album && (
                    <SearchAlbum search={search} />
                )}
                {segment === SegmentEnum.Track && (
                    <SearchTrack search={search} />
                )}
            </div>
        </div>
    )
}

type SearchArtistProps = {
    search: string
}

const SearchArtist: FC<SearchArtistProps> = ({ search }) => {
    const { data: artists, isLoading } = useQuery({
        queryKey: ["search-artists", search],
        queryFn: async () => {
            if (!search.length) return []
            const result = apiSearchArtistByName(search)
            return result
        },
    })

    const history = useHistory()
    const handleArtistClick = (artistId?: number) => {
        if (!artistId) return

        history.push(`/home/artist/${artistId}`)
    }

    if (isLoading) {
        return (
            <div className="flex-center w-full h-full">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!artists?.length) {
        return (
            <div className="flex-center w-full h-full">
                <span>No results found</span>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 pt-2 px-6">
            {artists.map((artist) => (
                <ArtistAlbumTrackItem
                    key={artist.id}
                    image={artist.avatarImageUrl ?? DEFAULT_AVATAR}
                    primaryText={artist.name}
                    secondaryText={`${artist.temp_popularity.toLocaleString()} monthly listeners`}
                    onClick={() => handleArtistClick(artist?.id)}
                />
            ))}
        </div>
    )
}

type SearchAlbumProps = {
    search: string
}

const SearchAlbum: FC<SearchAlbumProps> = ({ search }) => {
    const { data: albums, isLoading } = useQuery({
        queryKey: ["search-albums", search],
        queryFn: async () => {
            if (!search.length) return []
            const result = apiSearchAlbumByName(search)
            return result
        },
    })

    const history = useHistory()
    const handleAlbumClick = (albumId?: number) => {
        if (!albumId) return

        history.push(`/home/album/${albumId}`)
    }

    if (isLoading) {
        return (
            <div className="flex-center w-full h-full">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!albums?.length) {
        return (
            <div className="flex-center w-full h-full">
                <span>No results found</span>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 pt-2 px-6">
            {albums.map((album) => (
                <ArtistAlbumTrackItem
                    key={album.id}
                    image={album.coverImageUrl ?? DEFAULT_ALBUM_COVER}
                    primaryText={album.title}
                    secondaryText={`by ${album.artist?.name}`}
                    thirdText={`${album?.temp_popularity?.toLocaleString()} monthly listeners`}
                    onClick={() => handleAlbumClick(album.id)}
                    imageShape="square"
                />
            ))}
        </div>
    )
}

type SearchTrackProps = {
    search: string
}

const SearchTrack: FC<SearchTrackProps> = ({ search }) => {
    const [byLyrics, setByLyrics] = useState<boolean>(false)

    const { data: tracks, isLoading } = useQuery({
        queryKey: ["search-tracks", search, byLyrics],
        queryFn: async () => {
            if (!search.length) return []
            if (byLyrics) {
                const result = apiSearchTrackByLyrics(search)
                return result
            }
            const result = apiSearchTrackByTitle(search)
            return result
        },
    })

    const playingStore = usePlayingStore()
    const play1Song = useCallback(playingStore.play1Song, [playingStore])

    const handleTrackClick = async (trackId: number) => {
        await apiGetTrackById(trackId).then((_track) => {
            play1Song(_track)
        })
    }

    if (isLoading) {
        return (
            <div className="flex-col-center w-full">
                <div className="py-4 flex-center gap-4">
                    Search by lyrics
                    <IonToggle
                        checked={byLyrics}
                        onIonChange={() => {
                            setByLyrics((byLyrics) => !byLyrics)
                        }}
                    />
                </div>

                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!tracks?.length) {
        return (
            <div className="flex-col-center w-full">
                <div className="py-4 flex-center gap-4">
                    Search by lyrics
                    <IonToggle
                        checked={byLyrics}
                        onIonChange={() => {
                            setByLyrics((byLyrics) => !byLyrics)
                        }}
                    />
                </div>
                <span>No results found</span>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 px-6">
            <div className="py-4 flex-center gap-4">
                Search by lyrics
                <IonToggle
                    checked={byLyrics}
                    onIonChange={() => {
                        setByLyrics((byLyrics) => !byLyrics)
                    }}
                />
            </div>
            {tracks.map((track) => (
                <ArtistAlbumTrackItem
                    key={track.id}
                    image={track.album?.coverImageUrl ?? DEFAULT_ALBUM_COVER}
                    primaryText={track.title}
                    secondaryText={`by ${track?.mainArtist?.name}`}
                    thirdText={`${track.temp_popularity.toLocaleString()} monthly listeners`}
                    onClick={() => handleTrackClick(track.id)}
                    imageShape="square"
                />
            ))}
        </div>
    )
}

export default Search
