import { createWithEqualityFn } from "zustand/traditional"
import { getMe } from "../api"
import { User } from "@/entities"

import { Preferences } from "@capacitor/preferences"

interface IAuthState {
    token: string
    setToken: (token: string) => void
    authUser: User
    clear: () => void
    persistAuth: () => Promise<void>
    signedIn: () => boolean
}

const initialAuthState: Pick<IAuthState, "token" | "authUser"> = {
    token: "",
    authUser: {} as User,
}

export const useAuthStore = createWithEqualityFn<IAuthState>((set, get) => ({
    ...initialAuthState,
    token: "",
    clear: () => {
        Preferences.remove({
            key: "accessToken",
        })
        set(initialAuthState)
    },
    setToken: async (token: string) => {
        await Preferences.set({
            key: "accessToken",
            value: token,
        })

        // try to get preferenced and log
        const accessToken = await Preferences.get({
            key: "accessToken",
        })

        // console.log("::: accessToken", accessToken)

        try {
            const authUser = await getMe()
            set({ token, authUser })
        } catch (error) {
            await Preferences.remove({ key: "accessToken" })
            set(initialAuthState)
        }
    },
    persistAuth: async () => {
        const accessToken = await Preferences.get({ key: "accessToken" })

        if (!accessToken) return

        try {
            const me = await getMe()
            if (!me) {
                throw new Error("Invalid token")
            }

            set({ authUser: me })
        } catch (error) {
            console.log("error", error)
            await Preferences.remove({ key: "accessToken" })
            set(initialAuthState)
        }
    },
    signedIn: () => {
        return !!get().authUser?.email
    },
}))
