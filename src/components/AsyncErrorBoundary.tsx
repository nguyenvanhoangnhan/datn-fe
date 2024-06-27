import { FC, PropsWithChildren, useEffect } from "react"
import { v4 } from "uuid"
import { useIonToast } from "@ionic/react"
import configs from "@/utils/configs"

const AsyncErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
    const [present] = useIonToast()

    const presentToast = (message: string) => {
        present({
            message: message,
            position: "bottom",
            color: "danger",
            duration: configs.TOAST_DEFAULT_DURATION,
        })
    }

    useEffect(() => {
        window.addEventListener(
            "unhandledrejection",
            function (event) {
                event.promise.catch((error) => {
                    delete error.stack

                    console.log("unhandled rejection", error)

                    const errorMessage =
                        error?.response?.data?.error ?? error?.message

                    if (!errorMessage) {
                        presentToast("Something went wrong")
                        return
                    }

                    presentToast(errorMessage)
                })
            },
            false
        )

        return () => {
            window.removeEventListener("unhandledrejection", () => {})
        }
    }, [presentToast])

    return <>{children}</>
}

export default AsyncErrorBoundary
