import {
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonPage,
    IonPopover,
    IonTitle,
    IonToolbar,
} from "@ionic/react"
import ExploreContainer from "../../components/ExploreContainer"
import {
    Horse,
    VinylRecord,
    Cube,
    MagnifyingGlass,
    GearSix,
    SignOut,
} from "@phosphor-icons/react"
import { mainColor } from "@/theme/constant"
import Logo from "@/components/Logo"
import { useAuthStore } from "@/store/auth.store"
import { useQuery } from "@tanstack/react-query"
import { getGeneralRecommendationTracks, getPopularTracks } from "@/api"
import { FC, useCallback, useEffect, useState } from "react"
import { isNil } from "lodash"
import { Track } from "@/entities"
import PopularTracks from "./PopularTracks"
import RecommendedTracks from "./RecommendedTracks"

const TabHome: React.FC = () => {
    const authStore = useAuthStore()

    const logout = () => {
        authStore.clear()
    }

    return (
        <div className="py-12 px-8 w-screen flex flex-col">
            <div className="flex justify-between w-full items-center">
                <MagnifyingGlass size={24} color="white" />
                <Logo size="sm" />
                <GearButton />
            </div>
            <PopularTracks />
            <RecommendedTracks />
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
