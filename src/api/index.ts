import { $get, $post, $put } from "@/utils/axios"
import { LoginDto, RegisterDto } from "./req.dto"
import { LoginRespDto } from "./resp.dto"
import { Artist, Playlist, Track, User } from "@/entities"

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

/**
 * Get popular artists
 */
export async function getPopularArtists() {
    return $get<Artist[]>(`/artist/popular`).then((resp) => resp.data)
}

/**
 * Get popular tracks
 */
export async function getPopularTracks() {
    const result = await $get<Track[]>(`/track/popular?limit=100`).then(
        (resp) => resp.data
    )

    result.sort(() => Math.random() - 0.5)

    return result.slice(0, 10)
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
