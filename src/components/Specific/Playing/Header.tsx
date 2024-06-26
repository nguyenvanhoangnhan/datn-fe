import { usePlayingStore } from "@/store/playing.store"
import { CaretLeft } from "@phosphor-icons/react"
import { FC } from "react"

type PlayingHeaderProps = {
    // Define your props here if needed
}

const PlayingHeader: FC<PlayingHeaderProps> = ({}) => {
    const store = usePlayingStore()

    const close = () => store.closePlaying()

    return (
        <div className="__playing shadow-none flex-center relative w-full">
            <div
                onClick={close}
                className="
                absolute left-0
                p-[7px] bg-opacity-40 bg-black border border-[#333333] rounded-full inline-flex"
                style={{
                    boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.2)",
                }}
            >
                <CaretLeft color="white" size={16} weight="bold" />
            </div>
            <span className="font-bold text-lg text-gray-200">Now Playing</span>
        </div>
    )
}

export default PlayingHeader
