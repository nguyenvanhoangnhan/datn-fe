import { Track } from "@/entities"
import { usePlayingStore } from "@/store/playing.store"
import { mainColor } from "@/theme/constant"
import { DEFAULT_ALBUM_COVER } from "@/utils"
import { Heart } from "@phosphor-icons/react"
import { FC, useMemo, useCallback } from "react"

type PlayingTrackInfoProps = {
    track?: Track
}

const PlayingTrackInfo: FC<PlayingTrackInfoProps> = () => {
    const store = usePlayingStore()
    const track = useMemo(
        () => store.playingItem?.track,
        [store.playingItem?.track]
    )
    const likePlayingTrack = useCallback(store.likePlayingTrack, [store])
    const dislikePlayingTrack = useCallback(store.dislikePlayingTrack, [store])

    const coverImageUrl = useMemo(() => {
        if (!track?.album?.coverImageUrl) return DEFAULT_ALBUM_COVER

        return track.album.coverImageUrl
    }, [track?.album?.coverImageUrl])

    if (!track) {
        return (
            <div className="playing__info--no-track flex-col-center w-full flex-1 gap-4">
                No playing track right now
            </div>
        )
    }

    return (
        <div className="playing__info flex-col-center flex-1 gap-4 w-full">
            <img
                src={coverImageUrl}
                className="playing__info__album-cover rounded-lg"
                onClick={() => console.log("Hello")}
            />
            <div className="flex items-center justify-between w-full">
                <div
                    className="playing__info__text flex flex-col"
                    style={{
                        width: "calc(100% - 40px)",
                    }}
                >
                    <div className="relative flex w-full">
                        <span className="text-xl font-extrabold overflow-ellipsis line-clamp-1">
                            {track.title}
                        </span>
                    </div>
                    <span className="text-md font-medium overflow-ellipsis line-clamp-1">
                        {track?.artistNames}
                    </span>
                </div>
                <div
                    className="playing__info__favourite flex justify-end"
                    onClick={
                        track.isFavourite
                            ? dislikePlayingTrack
                            : likePlayingTrack
                    }
                >
                    <Heart
                        className="cursor-pointer"
                        weight={track.isFavourite ? "fill" : "duotone"}
                        color={mainColor}
                        size={24}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlayingTrackInfo
