import { apiGetRecentPlayTracks, apiGetTrackById } from "@/api"
import { usePlayingStore } from "@/store/playing.store"
import { IonSpinner } from "@ionic/react"
import { useQuery } from "@tanstack/react-query"
import React, { FC, useCallback } from "react"
import { ArtistAlbumTrackItem } from "../home/ArtistAlbumTracks"
import { DEFAULT_ALBUM_COVER, DEFAULT_AVATAR } from "@/utils"

type TabHistoryProps = {}

const TabHistory: FC<TabHistoryProps> = ({}) => {
    const { data: tracks, isLoading } = useQuery({
        queryKey: ["history-play-track"],
        queryFn: () => apiGetRecentPlayTracks(),
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
                <IonSpinner name="dots" />
            </div>
        )
    }

    if (!tracks?.length) {
        return (
            <div className="flex-col-center w-full">
                <span>No results</span>
            </div>
        )
    }

    return (
        <div className="pt-14 px-4 w-screen flex flex-col h-full">
            <div className="flex px-4 justify-between w-full items-center pb-6">
                <span className="opacity-0">.</span>
                <span className="font-bold text-xl">Recently listen</span>
                <span className="opacity-0">.</span>
            </div>
            <div className="w-full flex flex-col h-full overflow-y-hidden">
                <div className="w-full h-full overflow-y-scroll mt-2">
                    {isLoading ? (
                        <div className="w-full h-full flex-center">
                            <IonSpinner name="dots" />
                        </div>
                    ) : (
                        <div className="h-full flex flex-wrap gap-4">
                            {tracks.map((track) => (
                                <ArtistAlbumTrackItem
                                    key={track.id}
                                    image={
                                        track.album?.coverImageUrl ??
                                        DEFAULT_ALBUM_COVER
                                    }
                                    primaryText={track.title}
                                    secondaryText={`by ${track?.mainArtist?.name}`}
                                    thirdText={`${track.temp_popularity.toLocaleString()} monthly listeners`}
                                    onClick={() => handleTrackClick(track.id)}
                                    imageShape="square"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TabHistory
