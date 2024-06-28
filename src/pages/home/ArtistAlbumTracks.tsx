import {
    apiGetAlbumById,
    apiGetPopularAlbums,
    apiGetPopularArtists,
    apiGetPopularTracks,
    apiGetTrackById,
} from "@/api"
import { usePlayingStore } from "@/store/playing.store"
import { DEFAULT_AVATAR } from "@/utils"
import {
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonToggle,
} from "@ionic/react"
import { useQuery } from "@tanstack/react-query"
import React, { FC, useCallback, useState } from "react"
import { useHistory } from "react-router"

export type ArtistAlbumTrackProps = {
    // Define your props here if needed
}

enum SegmentEnum {
    Artist = "artist",
    Album = "album",
    Track = "track",
}

const ArtistAlbumTrack: FC<ArtistAlbumTrackProps> = ({}) => {
    const [segment, setSegment] = useState<SegmentEnum>(SegmentEnum.Artist)

    return (
        <div>
            <IonSegment
                value={segment}
                onIonChange={(e) => setSegment(e.detail.value as SegmentEnum)}
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

            {segment === SegmentEnum.Artist && <PopularArtists />}
            {segment === SegmentEnum.Album && <PopularAlbums />}
            {segment === SegmentEnum.Track && <PopularTracks />}
        </div>
    )
}

export default ArtistAlbumTrack

const PopularArtists: FC = ({}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-popular-artist-segment"],
        queryFn: () => apiGetPopularArtists(),
    })
    const history = useHistory()
    const handleArtistClick = (artistId?: number) => {
        if (!artistId) return

        history.push(`/home/artist/${artistId}`)
    }

    if (isLoading) {
        return (
            <div className="w-full h-16 flex-center">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="w-full h-16 flex-center text-xl font-bold">
                No Data
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 pt-2">
            {data.slice(0, 5).map((artist) => (
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

const PopularAlbums: FC = ({}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-popular-album-segment"],
        queryFn: () => apiGetPopularAlbums(),
    })
    const history = useHistory()

    const playingStore = usePlayingStore()
    const play = useCallback(playingStore.playAlbumOrPlayList, [playingStore])

    const handleAlbumClick = (albumId?: number) => {
        if (!albumId) return

        // apiGetAlbumById(albumId).then((album) => {
        //     console.log("album", album)
        //     if (!album) return
        //     if (!album.tracks) return

        //     play(album.tracks)
        // })

        history.push(`/home/album/${albumId}`)
    }

    if (isLoading) {
        return (
            <div className="w-full h-16 flex-center">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="w-full h-16 flex-center text-xl font-bold">
                No Data
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 pt-2">
            {data.slice(0, 5).map((album) => (
                <ArtistAlbumTrackItem
                    key={album.id}
                    image={album.coverImageUrl ?? DEFAULT_AVATAR}
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

const PopularTracks: FC = ({}) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-popular-track-segment"],
        queryFn: () => apiGetPopularTracks(),
    })
    const playingStore = usePlayingStore()
    const play1Song = useCallback(playingStore.play1Song, [playingStore])

    if (isLoading) {
        return (
            <div className="w-full h-16 flex-center">
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="w-full h-16 flex-center text-xl font-bold">
                No Data
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4 pt-2">
            {data.slice(0, 5).map((track) => (
                <ArtistAlbumTrackItem
                    key={track.id}
                    image={track.album?.coverImageUrl ?? DEFAULT_AVATAR}
                    primaryText={track.title}
                    secondaryText={`by ${track?.mainArtist?.name}`}
                    thirdText={`${track.temp_popularity.toLocaleString()} monthly listeners`}
                    onClick={async () => {
                        await apiGetTrackById(track.id).then((_track) => {
                            play1Song(_track)
                        })
                    }}
                    imageShape="square"
                />
            ))}
        </div>
    )
}

type ArtistAlbumTrackItemProps = {
    image: string
    primaryText: string
    secondaryText: string
    thirdText?: string
    onClick: () => void
    imageShape?: "circle" | "square"
}

export const ArtistAlbumTrackItem: FC<ArtistAlbumTrackItemProps> = ({
    image,
    primaryText,
    secondaryText,
    thirdText,
    onClick,
    imageShape = "circle",
}) => {
    return (
        <div className="flex w-full gap-4" onClick={onClick}>
            <div
                className="avatar-container overflow-hidden w-16 h-16 shrink-0"
                style={{
                    borderRadius: imageShape === "circle" ? "50%" : 0,
                }}
            >
                <img
                    src={image}
                    className="w-full h-full object-cover object-center"
                    alt="unknown"
                />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
                <h5 className="primary-text font-semibold text-sm m-0 line-clamp-1">
                    {primaryText}
                </h5>
                <p className="secondary-text text-xs m-0 line-clamp-1">
                    {secondaryText}
                </p>
                {thirdText && (
                    <p className="secondary-text text-xs m-0 line-clamp-1">
                        {thirdText}
                    </p>
                )}
            </div>
        </div>
    )
}
