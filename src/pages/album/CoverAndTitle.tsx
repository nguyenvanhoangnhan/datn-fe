import { FC } from "react"

type AlbumDetailCoverAndTitleProps = {
    name: string
    coverImageUrl: string
}

const AlbumDetailCoverAndTitle: FC<AlbumDetailCoverAndTitleProps> = ({
    name,
    coverImageUrl,
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="__playlist-detail__image relative w-full max-w-64 mx-auto aspect-square overflow-hidden rounded-lg">
                <img
                    className="object-cover w-full h-full"
                    src={coverImageUrl}
                />
            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs font-bold">Album</span>
                    <span className="font-bold text-2xl flex gap-2 items-center">
                        {name}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AlbumDetailCoverAndTitle
