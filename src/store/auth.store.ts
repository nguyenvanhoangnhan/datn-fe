import { JwtPayload, jwtDecode } from "jwt-decode"
import { create } from "zustand"

type AuthPayload = {}

type AuthState = {
    accessToken?: string
    payload?: JwtPayload & AuthPayload
}

type AuthAction = {
    setAccessToken: (token: string | undefined) => void
    decodeAndSetPayload: (token: string) => void
    signedIn: () => boolean
}

export const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    accessToken: "temp",
    payload: undefined,
    setAccessToken(token) {
        set({ accessToken: token })
    },
    decodeAndSetPayload(token) {
        const decoded = jwtDecode(token)
        set({ payload: decoded })
    },
    signedIn: () => !!get()?.accessToken,
}))
