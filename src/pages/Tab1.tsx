import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react"
import ExploreContainer from "../components/ExploreContainer"
import { Horse, VinylRecord, Cube } from "@phosphor-icons/react"
import { mainColor } from "@/theme/constant"
import Logo from "@/components/Logo"
import { useAuthStore } from "@/store/auth.store"

const Tab1: React.FC = () => {
    const authStore = useAuthStore()

    const logout = () => {
        authStore.setAccessToken(undefined)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 1</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 1</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="w-full h-full flex-center">
                    <div onClick={logout} className="cursor-pointer">
                        Logout
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Tab1
