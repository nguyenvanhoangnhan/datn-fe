import { CaretLeft } from "@phosphor-icons/react"
import { FC } from "react"
import { useHistory } from "react-router"

type PlaylistDetailHeaderProps = {
    title: string
}

const PlaylistDetailHeader: FC<PlaylistDetailHeaderProps> = ({ title }) => {
    return (
        <>
            <div className="__playlist-detail__header flex justify-between w-full items-center pb-4">
                <BackButton />
                <span className="font-bold text-xl">{title}</span>
                <span className="opacity-0 base-for-flex-between">
                    <BackButton />
                </span>
            </div>
        </>
    )
}

export default PlaylistDetailHeader

type BackButtonProps = {
    // Define your props here if needed
}

const BackButton: FC<BackButtonProps> = ({}) => {
    const history = useHistory()
    const handleClick = () => {
        history.push("/playlist")
    }

    return (
        <>
            <div
                onClick={handleClick}
                className="p-[7px] bg-opacity-40 bg-black border border-[#333333] rounded-full inline-flex"
                style={{
                    boxShadow: "0px 0px 2px rgba(255, 255, 255, 0.2)",
                }}
            >
                <CaretLeft
                    color="white"
                    size={16}
                    weight="bold"
                    className="cursor-pointer"
                />
            </div>
        </>
    )
}
