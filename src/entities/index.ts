export type AlbumGroup = "single" | "album" | "appears_on" | "compilation"

// Same as spotify API SimplifiedAlbumObject.album_type
export type AlbumType = "album" | "single" | "compilation"

export type User = {
    id: number
    email: string
    avatarImageUrl: string | null
    createdAt?: number | null
    updatedAt?: number | null
}

export type Artist = {
    id: number
    spotifyArtistId: string | null
    name: string
    introduction: string | null
    userId: number | null
    avatarImageUrl: string | null
    createdAt: number | null
    updatedAt: number | null

    albums?: Album[] | null
    tracks?: Track[] | null
    User?: User | null
}

export type Album = {
    id: number
    spotifyAlbumId: string
    title: string | null
    artistId: number
    coverImageUrl: string | null
    albumGroup: AlbumGroup | null
    albumType: AlbumType | null
    releasedAt: number | null
    createdAt: number | null
    updatedAt: number | null

    tracks?: Track[] | null
    artist?: Artist | null
    user_listen_albums?: Pivot_UserListenAlbum[] | null
}

export type Playlist = {
    id: number
    name: string
    description: string | null
    ownerUserId: number
    coverImageUrl: string
    createdAt: number | null
    updatedAt: number | null

    trackCount: number

    isLikedSongList?: 0 | 1

    ownerUser?: User | null
    playlist_track_links?: Pivot_PlaylistTrackLink[]
}

export type Track = {
    id: number
    title: string
    artistNames: string
    spotifyTrackId: string
    mainArtistId: number
    listenCount: number
    albumId: number
    audioId: number | null

    isFavourite?: 0 | 1

    mainArtist?: Artist
    album?: Album
    audio?: Audio | null
    user_listen_tracks?: Pivot_UserListenTrack[] | null
    user_favourite_tracks?: Pivot_UserFavouriteTrack[] | null
    playlist_track_links?: Pivot_PlaylistTrackLink[] | null
    secondary_artist_track_links?: Pivot_SecondaryArtistTrackLink[] | null
    lyrics?: Lyrics | null
}

export type Audio = {
    id?: number | null
    label?: string | null
    path?: string | null
    s3ObjectKey?: string | null
    size?: number | null
    length?: number | null
    fullUrl?: string
    createdAt?: number | null
    updatedAt?: number | null
    track?: Track[] | null
}

export type Pivot_UserListenTrack = {
    id: number
    userId: number
    trackId: number
    track?: Track
}

export type Pivot_UserFavouriteTrack = {
    id: number
    userId: number
    trackId: number
    track?: Track
}

export type Pivot_PlaylistTrackLink = {
    id: number
    playlistId: number
    trackId: number
    track?: Track
    playlist?: Playlist
}

export type Pivot_UserListenAlbum = {
    id: number
    userId: number
    albumId: number
    album?: Album
}

export type Pivot_SecondaryArtistTrackLink = {
    id: number
    artistId: number
    trackId: number
    track?: Track
    artist?: Artist
}

export type Lyrics = {
    id?: number
    trackId?: number
    content: string
    createdAt?: number
    updatedAt?: number

    track?: Track
}
