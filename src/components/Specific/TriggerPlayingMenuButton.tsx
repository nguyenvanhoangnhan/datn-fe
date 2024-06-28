import { useAuthStore } from "@/store/auth.store"
import { usePlayingStore } from "@/store/playing.store"
import { mainColor } from "@/theme/constant"
import { VinylRecord } from "@phosphor-icons/react"
import React, { FC, useEffect, useState } from "react"

export type PlayingButtonProps = {
    // Define your props here if needed
}

const PlayingButton: FC<PlayingButtonProps> = ({}) => {
    const isPlaying = usePlayingStore((state) => state.isPLaying)
    const isSignedIn = useAuthStore((state) => state.signedIn())
    const openPlayingMenu = usePlayingStore((state) => state.openPlaying)
    const [bottom, setBottom] = useState(32)

    useEffect(() => {
        console.log(":::PlayingButton useEffect running:::")

        setTimeout(() => {
            const ionTabBar = document.querySelector(".__ion_tab_bar")
            if (!ionTabBar) return

            const ionTabBarHeight = ionTabBar.clientHeight

            const halfOfButtonHeight = 64 / 2

            setBottom(ionTabBarHeight - halfOfButtonHeight)
        }, 500)
    }, [isSignedIn])

    if (!isSignedIn) return null

    return (
        <div
            className="__playing_btn bg-black rounded-full z-[55] p-3 bottom-8 left-1/2 fixed -translate-x-1/2 cursor-pointer"
            style={{
                bottom: `${bottom}px`,
            }}
            onClick={openPlayingMenu}
        >
            <VinylRecord
                weight="bold"
                color={mainColor}
                size={40}
                style={{
                    animation: isPlaying ? "spin 1.5s linear infinite" : "none",
                }}
            />
        </div>
    )
}

export default PlayingButton
