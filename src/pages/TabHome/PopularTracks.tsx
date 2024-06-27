import { apiGetTrackById, getPopularTracks } from "@/api"
import { Track } from "@/entities"
import { usePlayingStore } from "@/store/playing.store"
import { IonSpinner } from "@ionic/react"
import { PlayCircle } from "@phosphor-icons/react/dist/ssr"
import { useQuery } from "@tanstack/react-query"
import { isNil } from "lodash"
import { FC, useState, useEffect, useCallback } from "react"

type PopularTracksProps = {
    // Define your props here if needed
}

const PopularTracks: FC<PopularTracksProps> = ({}) => {
    const playingStore = usePlayingStore()

    const { data, isLoading } = useQuery({
        queryKey: ["get-popular-tracks"],
        queryFn: getPopularTracks,
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            if (isNil(data)) return

            setCurrentIndex((prev) => {
                if (prev === data?.length - 1) return 0
                return prev + 1
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [data])

    const handleClick = async () => {
        if (!data) return

        setLoading(true)
        try {
            await apiGetTrackById(data[currentIndex].id).then((_track) => {
                playingStore.play1Song(_track)
            })
        } finally {
            setLoading(false)
        }
    }

    if (!data?.at(0)) return null

    return (
        <div
            className="relative w-full overflow-x-hidden mb-8 group cursor-pointer"
            onClick={handleClick}
        >
            <div
                className="flex flex-nowrap relative transition-all ease-in-out duration-300 pointer-events-none"
                style={{
                    scrollSnapType: "x mandatory",
                    right: `${currentIndex * 100}%`,
                }}
            >
                {data?.map((track, index) => {
                    return <SinglePopularTrack track={track} key={track.id} />
                })}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 absolute top-0 left-0 flex-center bg-black bg-opacity-20 w-full h-full pointer-events-none">
                <PlayCircle color="white" size={48} />
            </div>

            <div className="absolute top-6 left-6 pointer-event-none">
                <p className="mb-2 font-bold text-sm">Popular</p>
            </div>

            {loading && (
                <div className="w-screen h-screen fixed flex-center top-0 left-0 z-[888888] bg-black opacity-30">
                    <IonSpinner name="dots" />
                </div>
            )}
        </div>
    )
}

export default PopularTracks

//Single mean one track
type SinglePopularTrackProps = {
    track: Track
}

const SinglePopularTrack: FC<SinglePopularTrackProps> = ({ track }) => {
    return (
        <div className="__popular_track pointer-events-none relative w-full flex-shrink-0 flex flex-col rounded-lg overflow-hidden">
            {/* Images */}
            <div className="__popular_track__image absolute top-0 left-0 h-full flex">
                {/*Image1 */}
                <div className="flex-1">
                    {track?.mainArtist?.avatarImageUrl && (
                        <img
                            className="object-center object-cover w-full h-full"
                            src={track?.mainArtist?.avatarImageUrl ?? ""}
                        />
                    )}
                </div>

                {/*Image2 */}
                <div className="aspect-square h-full overflow-hidden">
                    {track?.album?.coverImageUrl && (
                        <img src={track?.album?.coverImageUrl ?? ""} />
                    )}
                </div>
            </div>

            {/* Overlay */}
            <div className="absolute top-0 left-0 bg-ongakool w-full h-full bg-opacity-10"></div>
            <div className="absolute top-0 left-0 bg-black w-full h-full bg-opacity-30"></div>

            {/* Text */}
            <div className="py-4 px-6 relative">
                <p className="mb-2 font-bold text-xs opacity-0">.</p>
                <p className="mb-2 font-bold text-xs opacity-0 ">.</p>
                <p className="mb-2 font-bold text-xs opacity-0">.</p>
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-lg line-clamp-1">
                        {track?.title}
                    </span>
                    <span className="text-sm line-clamp-1">
                        <span className="font-medium">by </span>
                        <span className="font-bold">
                            {track?.mainArtist?.name}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}
