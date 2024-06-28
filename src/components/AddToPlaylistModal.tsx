import { getMyPlaylists } from "@/api"
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
} from "@ionic/react"
import { useQuery } from "@tanstack/react-query"
import { FC, useRef } from "react"

export type AddToPlaylistModalProps = {
    trackId: number
    dismiss: (
        data?: {
            playlistId: number
        } | null,
        role?: string
    ) => void
}

const AddToPlaylistModal: FC<AddToPlaylistModalProps> = ({ dismiss }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["get-my-playlist-modal-add"],
        queryFn: getMyPlaylists,
    })

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton
                            color="medium"
                            onClick={() => dismiss(null, "cancel")}
                        >
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle class="text-center">Add to playlist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="w-full flex flex-col gap-2">
                    {isLoading && <span>Loading...</span>}

                    {data
                        ?.filter((i) => i.id !== -1)
                        ?.map((playlist) => (
                            <div className="py-2">
                                <IonItem
                                    button
                                    onClick={() => {
                                        dismiss(
                                            { playlistId: playlist.id },
                                            "add"
                                        )
                                    }}
                                >
                                    {playlist.name}
                                </IonItem>
                            </div>
                        ))}
                </div>
            </IonContent>
        </IonPage>
    )
}
export default AddToPlaylistModal
