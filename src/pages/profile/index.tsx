import { mainColor } from "@/theme/constant"
import { IonPopover, IonContent, IonList, IonItem } from "@ionic/react"
import {
    CaretLeft,
    DotsThree,
    DotsThreeOutline,
    SignOut,
} from "@phosphor-icons/react"
import React, { FC, useCallback } from "react"
import { useHistory } from "react-router"
import { useAuthStore } from "@/store/auth.store"
import { DEFAULT_AVATAR } from "@/utils"

export type TabProfileProps = {
    // Define your props here if needed
}

const TabProfile: FC<TabProfileProps> = ({}) => {
    return (
        <div
            id="__profile_page"
            className="relative flex flex-col w-full h-screen overflow-y-scroll bg-black z-[88]"
        >
            <Header />
            <div className="py-12 pt-14 p-10 gap-8"></div>
        </div>
    )
}

type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
    const history = useHistory()

    const handleBack = () => {
        history.push("/home")
    }

    const auth = useAuthStore()

    const logout = useCallback(() => auth.clear(), [auth])

    return (
        <div className="__playing shadow-none flex flex-col relative w-full">
            <span className="w-full pb-12 bg-[#333] rounded-b-[48px] overflow-hidden relative">
                <div className="w-full object-cover pt-12 px-6 flex justify-between items-center">
                    <DotsThree className="opacity-0" />
                    <span className="font-bold text-lg">Profile</span>
                    <DotsThreeOutline
                        id="profile-dot-3"
                        className="cursor-pointer"
                        weight="duotone"
                    />
                    <IonPopover trigger="profile-dot-3" dismissOnSelect={true}>
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
                </div>
                <div className="flex-col-center w-full mt-8 gap-4">
                    <div className="avatar-container w-24 h-24 overflow-hidden">
                        <img
                            className="w-full h-full object-cover rounded-full"
                            src={
                                auth.authUser?.avatarImageUrl ?? DEFAULT_AVATAR
                            }
                            alt="avatar"
                        />
                    </div>
                    <div className="flex-col-center gap-1">
                        <span className="font-bold text-lg">
                            {auth?.authUser?.fullname ?? "Lorem Ipsum"}
                        </span>
                        <span className="font-medium text-xs">
                            {auth?.authUser?.email ?? "example@email.com"}
                        </span>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default TabProfile
