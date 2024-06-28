import { usePlayingStore } from "@/store/playing.store"
import { CaretLeft, CaretUp } from "@phosphor-icons/react"
import { FC, TouchEvent, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import "./style.less"
import PlayingTrackInfo from "./PlayingTrackInfo"
import PlayingHeader from "./Header"
import Lyrics from "./Lyrics"
import Audio from "./Audio"
import Player from "./Player"

export type PlayingProps = {
    // Define your props here if needed
}

const Playing: FC<PlayingProps> = ({}) => {
    const store = usePlayingStore()

    const isOpen = useMemo(() => store.isOpenPlaying, [store.isOpenPlaying])
    const [isOpenLyrics, setIsOpenLyrics] = useState(false)
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
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isDownSwipe = distance < -minSwipeDistance
        const isUpSwipe = distance > minSwipeDistance

        if (isDownSwipe || isUpSwipe)
            if (isDownSwipe) {
                // add your conditional logic here
                if (isOpenLyrics) {
                    setIsOpenLyrics(false)
                    return
                }
                close()
            }
        if (isUpSwipe) {
            setIsOpenLyrics(true)
        }
    }

    const audioElementRef = useRef<HTMLAudioElement>(null)

    return (
        <div
            className={clsx(
                "__playing-menu-modal w-screen h-[200vh] z-[90] bg-[#333333]",
                isOpen && !isOpenLyrics && "__playing-menu-modal--open",
                isOpen && isOpenLyrics && "__playing-menu-modal--open-lyrics"
            )}
            onTouchStart={(e) => onTouchStart(e)}
            onTouchMove={(e) => onTouchMove(e)}
            onTouchEnd={(e) => onTouchEnd()}
        >
            <div className="flex flex-col py-12 pt-14 p-10 gap-8 w-full h-screen">
                <PlayingHeader />
                <PlayingTrackInfo />
                <Audio audioElementRef={audioElementRef} />
                <Player audioRef={audioElementRef} mini />
                <div className="flex-center">
                    <div
                        className="w-16 flex-col-center cursor-pointer"
                        onClick={() => setIsOpenLyrics(true)}
                    >
                        <CaretUp
                            size={24}
                            weight="light"
                            style={{
                                // animation up and down for the caret
                                animation: "updown 1s infinite",
                            }}
                        />
                        <span className="-mt-1">Lyrics</span>
                    </div>
                </div>
            </div>
            <Lyrics
                audioRef={audioElementRef}
                onCancel={() => setIsOpenLyrics(false)}
            />
        </div>
    )
}

/*************** */

export default Playing
