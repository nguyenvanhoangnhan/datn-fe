import { createPlaylist } from "@/api"
import { IonSpinner } from "@ionic/react"
import { Plus } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import React, { FC } from "react"
import { useHistory } from "react-router"

export type CreatePlaylistButtonProps = {
    afterCreated?: () => Promise<void>
}

const CreatePlaylistButton: FC<CreatePlaylistButtonProps> = ({
    afterCreated,
}) => {
    const history = useHistory()

    const { isPending, mutate } = useMutation({
        mutationFn: () =>
            createPlaylist().then(async (playlist) => {
                await afterCreated?.()

                history.push(`/playlist/detail/${playlist.id}`)
            }),
    })

    return (
        <>
            <Plus
                size={24}
                color="white"
                weight="bold"
                cursor="pointer"
                onClick={() => mutate()}
            />
            {isPending && (
                <div className="w-screen h-screen fixed flex-center top-0 left-0 z-[888888] bg-black opacity-30">
                    <IonSpinner name="dots" />
                </div>
            )}
        </>
    )
}

export default CreatePlaylistButton
