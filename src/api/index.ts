import { $get, $post, $put } from "@/utils/axios"
import { LoginDto, RegisterDto } from "./req.dto"
import { LoginRespDto } from "./resp.dto"
import { Album, Artist, Playlist, Track, User } from "@/entities"

export const apiLogin = async (payload: LoginDto) => {
    return $post<LoginRespDto>(`/auth/login`, {
        ...payload,
    }).then((resp) => resp.data)
}

export const apiRegister = async (payload: RegisterDto) => {
    return $post<LoginRespDto>(`/auth/register`, {
        ...payload,
    }).then((resp) => resp.data)
}

export const getMe = async () => {
    return $get<User>(`/auth/me`).then((resp) => resp.data)
}

// TRACKS

/**
 * Get Recommendation by recent played tracks, if it's empty, get random most played tracks
 */
export async function getGeneralRecommendationTracks() {
    return $get<Track[]>(`/track/recommendation/recently-listening-based`).then(
        (resp) => resp.data
    )
}

export async function getMyPlaylists() {
    return $get<Playlist[]>(`/playlist/mine`).then((resp) => resp.data)
}

export async function getPlaylistDetail(playlistId: number) {
    return $get<Playlist>(`/playlist/${playlistId}`).then((resp) => resp.data)
}

export async function createPlaylist() {
    return $post<Playlist>(`/playlist`).then((resp) => resp.data)
}

export async function updatePlaylist(
    playlistId: number,
    payload: Pick<Playlist, "name" | "description">
) {
    return $put<Playlist>(`/playlist/${playlistId}`, payload).then(
        (resp) => resp.data
    )
}

export async function addTrackToPlaylist(playlistId: number, trackId: number) {
    return $post<Playlist>(`/playlist/add-track/${playlistId}/${trackId}`).then(
        (resp) => resp.data
    )
}

export async function removeTrackFromPlaylist(
    playlistId: number,
    trackId: number
) {
    return $post<Playlist>(
        `/playlist/remove-track/${playlistId}/${trackId}`
    ).then((resp) => resp.data)
}

export async function updatePlaylistCover(playlistId: number, file: File) {
    const formData = new FormData()
    formData.append("file", file)

    return $post<Playlist>(`/playlist/${playlistId}/set-cover`, formData).then(
        (resp) => resp.data
    )
}

export async function apiGetTrackById(trackId: number) {
    return $get<Track>(`/track/${trackId}`).then((resp) => resp.data)
}

export async function apiTrackListenToTrack(trackId: number) {
    return $post(`/track/${trackId}/listen`)
}

export async function apiGetRecommendationForPlaylists(playlistId: number) {
    return $get<Track[]>(`/playlist/${playlistId}/recommend-tracks`).then(
        (resp) => resp.data
    )
}

/**
 * Popular
 */

export async function apiGetPopularArtists() {
    return $get<Artist[]>(`/artist/popular`).then((resp) => resp.data)
}

export async function apiGetPopularAlbums() {
    return $get<Album[]>(`/album/popular`).then((resp) => resp.data)
}

export async function apiGetPopularTracks() {
    return $get<Track[]>(`/track/popular`).then((resp) => resp.data)
}

export async function apiGetRandomPopularTracks() {
    const result = await $get<Track[]>(`/track/popular?limit=100`).then(
        (resp) => resp.data
    )

    result.sort(() => Math.random() - 0.5)

    return result.slice(0, 10)
}

export async function apiGetArtistById(artistId: string) {
    return $get<Artist>(`/artist/${artistId}`).then((resp) => resp.data)
}

export async function apiGetSimilarArtists(artistId: number) {
    return $get<Artist[]>(`/artist/${artistId}/similar-artists?limit=10`).then(
        (resp) => resp.data
    )
}

export async function apiSearchTrackByTitle(title?: string) {
    if (!title?.length) {
        return []
    }

    return $get<Track[]>(`/track/search-by-title?text=${title}&limit=20`).then(
        (resp) => resp.data
    )
}

export async function apiSearchTrackByLyrics(lyrics?: string) {
    if (!lyrics?.length) {
        return []
    }

    return $get<Track[]>(
        `/track/search-by-lyrics?text=${lyrics}&limit=20`
    ).then((resp) => resp.data)
}

export async function apiSearchArtistByName(name?: string) {
    if (!name?.length) {
        return []
    }

    console.log("searching artist by name", name)

    return $get<Artist[]>(`/artist/search-by-name/${name}`).then(
        (resp) => resp.data
    )
}

export async function apiSearchAlbumByName(name?: string) {
    if (!name?.length) {
        return []
    }

    return $get<Album[]>(`/album/search/${name}`).then((resp) => resp.data)
}

export async function apiGetRecentPlayTracks() {
    return $get<Track[]>(`/track/get-recent`).then((resp) => resp.data)
}

export async function apiGetAlbumById(albumId: number) {
    return $get<Album>(`/album/${albumId}`).then((resp) => resp.data)
}

export async function dislikeTrack(trackId: number) {
    return $post(`/track/toggle-like`, {
        trackId,
        toggleOn: 0,
    })
}

export async function likeTrack(trackId: number) {
    return $post(`/track/toggle-like`, {
        trackId,
        toggleOn: 1,
    })
}
