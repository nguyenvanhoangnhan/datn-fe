import {
    IonContent,
    IonHeader,
    IonPage,
    IonSpinner,
    IonTitle,
    IonToolbar,
} from "@ionic/react"
import ExploreContainer from "../../components/ExploreContainer"
import { Cross, MagnifyingGlass, Plus } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { getMyPlaylists } from "@/api"
import { Playlist } from "@/entities"
import { FC } from "react"
import CreatePlaylistButton from "./CreatePlaylistButton"
import { useHistory } from "react-router"

const TabPlaylist: React.FC = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-my-playlist"],
        queryFn: getMyPlaylists,
    })

    const _refetch = async () => {
        await refetch()
    }

    return (
        <div className="pt-12 px-4 w-screen flex flex-col h-full">
            <div className="flex px-4 justify-between w-full items-center pb-4">
                <MagnifyingGlass size={24} color="white" />
                <span className="font-bold text-xl">Playlist</span>
                <CreatePlaylistButton afterCreated={_refetch} />
            </div>

            <div className="w-full h-full overflow-y-scroll mt-2">
                {isLoading ? (
                    <div className="w-full h-full flex-center">
                        <IonSpinner name="dots" />
                    </div>
                ) : (
                    <div className="h-full flex flex-wrap">
                        {data?.map((playlist) => {
                            return (
                                <SinglePlaylist
                                    playlist={playlist}
                                    key={playlist.id}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

type SinglePlaylistProps = {
    playlist: Playlist
}

const SinglePlaylist: FC<SinglePlaylistProps> = ({ playlist }) => {
    const history = useHistory()

    const handleClick = () => {
        console.log("Clicked", playlist.id)

        history.push(`/playlist/detail/${playlist.id}`)
    }

    return (
        <div
            className="w-1/2 px-4 flex flex-col mb-2 cursor-pointer"
            onClick={handleClick}
        >
            <div className="rounded-md aspect-square overflow-hidden mb-1">
                <img
                    src={
                        playlist?.coverImageUrl ??
                        "https://via.placeholder.com/300"
                    }
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col">
                <p className="line-clamp-1 font-bold text-sm">
                    {playlist.name}
                </p>
                <p className="text-xs">{playlist.trackCount} songs</p>
            </div>
        </div>
    )
}

export default TabPlaylist
