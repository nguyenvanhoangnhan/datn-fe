import { apiGetTrackById, getGeneralRecommendationTracks } from "@/api"
import SmallPlay from "@/components/SVG/SmallPlay"
import { Track } from "@/entities"
import { usePlayingStore } from "@/store/playing.store"
import { IonSpinner } from "@ionic/react"
import { useQuery } from "@tanstack/react-query"
import { FC, useState } from "react"

type RecommendedTracksProps = {
    // Define your props here if needed
}

const RecommendedTracks: FC<RecommendedTracksProps> = ({}) => {
    const { data, isLoading: loadingRecommendationTracks } = useQuery({
        queryKey: ["get-general-recommendation-tracks"],
        queryFn: getGeneralRecommendationTracks,
    })

    return (
        <div className="w-full ">
            <h2 className="text-xl font-bold mb-2">Recommended for you</h2>
            <div className="relative w-full overflow-x-scroll mb-8 group flex gap-4">
                {data?.slice(0, 10)?.map((track, index) => {
                    return (
                        <SingleRecommendedTrack key={track.id} track={track} />
                    )
                })}
            </div>
        </div>
    )
}

type SingleRecommendedTrackProps = {
    track: Track
}

const SingleRecommendedTrack: FC<SingleRecommendedTrackProps> = ({ track }) => {
    const playingStore = usePlayingStore()

    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            await apiGetTrackById(track.id).then((_track) => {
                playingStore.play1Song(_track)
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-shrink-0 flex-col" onClick={handleClick}>
            <div className="w-36 overflow-hidden rounded-xl relative">
                <img
                    className="w-full"
                    src={track?.album?.coverImageUrl ?? ""}
                    alt=""
                />
                <div className="absolute right-3 bottom-3">
                    <SmallPlay />
                </div>
            </div>
            <div className="flex flex-col w-36">
                <span className="font-bold text-sm line-clamp-1 overflow-ellipsis">
                    {track.title}
                </span>
                <span className="font-medium text-xs line-clamp-1">
                    {track.artistNames}
                </span>
            </div>

            {loading && (
                <div className="w-screen h-screen fixed flex-center top-0 left-0 z-[888888] bg-black opacity-30">
                    <IonSpinner name="dots" />
                </div>
            )}
        </div>
    )
}

export default RecommendedTracks
