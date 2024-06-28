import { Preferences } from "@capacitor/preferences"
import React, { FC, useEffect } from "react"

export type LogOutHandlePageProps = {
    // Define your props here if needed
}

const LogOutHandlePage: FC<LogOutHandlePageProps> = ({}) => {
    useEffect(() => {
        const logOut = async () => {
            // Remove the user token from the preferences
            await Preferences.remove({ key: "accessToken" })
            // Redirect to the home page
            window.location.href = "/login"
        }
        logOut()
    }, [])

    return <></>
}

export default LogOutHandlePage
