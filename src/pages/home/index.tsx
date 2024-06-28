import { IonContent, IonItem, IonList, IonPopover } from "@ionic/react"
import { MagnifyingGlass, GearSix, SignOut } from "@phosphor-icons/react"
import { mainColor } from "@/theme/constant"
import Logo from "@/components/Logo"
import { useAuthStore } from "@/store/auth.store"
import { FC, useCallback } from "react"
import PopularTracks from "./PopularTracks"
import RecommendedTracks from "./RecommendedTracks"
import ArtistAlbumTracks from "./ArtistAlbumTracks"
import { useHistory } from "react-router"

const TabHome: React.FC = () => {
    const authStore = useAuthStore()

    const logout = () => {
        authStore.clear()
    }

    const history = useHistory()

    return (
        <div className="py-12 px-8 w-screen flex flex-col">
            <div className="flex justify-between w-full items-center">
                <MagnifyingGlass
                    size={24}
                    color="white"
                    onClick={() => history.push("/home/search")}
                />
                <Logo size="sm" />
                <GearButton />
            </div>
            <PopularTracks />
            <RecommendedTracks />
            <ArtistAlbumTracks />
        </div>
    )
}

type GearButtonProps = {
    // Define your props here if needed
}

const GearButton: FC<GearButtonProps> = ({}) => {
    const authStore = useAuthStore()

    const logout = useCallback(() => authStore.clear(), [authStore])

    return (
        <>
            <GearSix
                size={24}
                color="white"
                id="gear-button"
                className="cursor-pointer"
            />
            <IonPopover trigger="gear-button" dismissOnSelect={true}>
                <IonContent>
                    <IonList>
                        <IonItem
                            button={true}
                            detail={false}
                            onClick={logout}
                            className="text-ongakool"
                        >
                            <span className="flex gap-2 font-bold">
                                <SignOut
                                    size={24}
                                    color={mainColor}
                                    weight="bold"
                                />{" "}
                                Logout
                            </span>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPopover>
        </>
    )
}

export default TabHome
