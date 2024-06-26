import { usePlayingStore } from "@/store/playing.store"
import { CaretLeft } from "@phosphor-icons/react"
import { FC, TouchEvent, useMemo, useState } from "react"
import clsx from "clsx"
import "./style.less"
import AudioPlayer from "./AudioPlayer"
import PlayingTrackInfo from "./PlayingTrackInfo"
import PlayingHeader from "./Header"

export type PlayingProps = {
    // Define your props here if needed
}

const Playing: FC<PlayingProps> = ({}) => {
    const store = usePlayingStore()

    const isOpen = useMemo(() => store.isOpenPlaying, [store.isOpenPlaying])
    const open = () => store.openPlaying()
    const close = () => store.closePlaying()

    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const minSwipeDistance = 60

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientY)

        if (touchStart) {
            console.log(
                `move ${touchStart} -> ${e.targetTouches[0].clientY} = ${
                    touchStart - e.targetTouches[0].clientY
                }`
            )
        }
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isDownSwipe = distance < -minSwipeDistance
        const isUpSwipe = distance > minSwipeDistance

        if (isDownSwipe || isUpSwipe)
            console.log("swipe", isDownSwipe ? "down" : "up")
        // add your conditional logic here
        if (isDownSwipe) {
            close()
        }
    }

    return (
        <div
            className={clsx(
                "__playing-menu-modal w-screen h-screen z-[123456] bg-[#333333]",
                isOpen && "__playing-menu-modal--open"
            )}
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd()}
        >
            <div className="flex flex-col py-12 p-10 gap-8 w-full h-full">
                <PlayingHeader />
                <PlayingTrackInfo />
                <AudioPlayer />
            </div>
        </div>
    )
}

/*************** */

export default Playing
