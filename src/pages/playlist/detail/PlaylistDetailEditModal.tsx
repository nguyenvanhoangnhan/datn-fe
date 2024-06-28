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
import { FC, useRef } from "react"

export type PlaylistDetailEditModalProps = {
    initialName?: string
    initialDescription?: string
    dismiss: (
        data?: {
            name: string
            description: string | undefined | null
        } | null,
        role?: string
    ) => void
}

const PlaylistDetailEditModal: FC<PlaylistDetailEditModalProps> = ({
    initialName,
    initialDescription,
    dismiss,
}) => {
    const inputNameRef = useRef<HTMLIonInputElement>(null)
    const inputDescriptionRef = useRef<HTMLIonTextareaElement>(null)

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
                    <IonTitle class="text-center">Edit Playlist</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={() =>
                                dismiss(
                                    {
                                        name:
                                            inputNameRef.current?.value?.toString() ??
                                            "Playlist name",
                                        description:
                                            inputDescriptionRef.current?.value,
                                    },
                                    "confirm"
                                )
                            }
                            strong={true}
                        >
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput
                        ref={inputNameRef}
                        value={initialName}
                        labelPlacement="stacked"
                        label="Name"
                        placeholder="Enter playlist name"
                    />
                </IonItem>
                <IonItem>
                    <IonTextarea
                        ref={inputDescriptionRef}
                        value={initialDescription}
                        labelPlacement="stacked"
                        maxlength={128}
                        label="Description"
                        rows={8}
                        placeholder="Enter playlist description"
                    />
                </IonItem>
            </IonContent>
        </IonPage>
    )
}
export default PlaylistDetailEditModal
