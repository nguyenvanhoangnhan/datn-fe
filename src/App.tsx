import { Redirect, Route } from "react-router-dom"
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import {
    ellipse,
    personOutline,
    square,
    timeOutline,
    triangle,
} from "ionicons/icons"
import Tab1 from "./pages/Tab1"
import Tab2 from "./pages/Tab2"
import Tab3 from "./pages/Tab3"

import "./theme/tailwind.css"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css" // Not needed with Tailwind
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out || NOTE: Commented because of Tailwind */
// import "@ionic/react/css/padding.css"
// import "@ionic/react/css/float-elements.css"
// import "@ionic/react/css/text-alignment.css"
// import "@ionic/react/css/text-transformation.css"
// import "@ionic/react/css/flex-utils.css"
// import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import "@ionic/react/css/palettes/dark.always.css"
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import "@ionic/react/css/palettes/dark.system.css" */

/* Theme variables */
import "./theme/variables.css"
import LoadingPage from "./pages/LoadingPage"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import { FC, useMemo, useState } from "react"
import { useAuthStore } from "./store/auth.store"
import { ProtectedRoute } from "./components/ProtectedRoute"
import {
    Clock,
    HouseSimple,
    Playlist,
    User,
    VinylRecord,
} from "@phosphor-icons/react"
import { mainColor } from "./theme/constant"
import { usePlayingStore } from "./store/playing.store"
import TriggerPlayingMenuButton from "./components/Specific/TriggerPlayingMenuButton"
import Playing from "./components/Specific/Playing"
import { isPlatform } from "@ionic/react"

setupIonicReact()

const App: React.FC = () => {
    const isSignedIn = useAuthStore((state) => state.signedIn())
    const isIos = isPlatform("ios")

    return (
        <IonApp>
            <TriggerPlayingMenuButton />
            <Playing />
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <ProtectedRoute exact path="/home">
                            <Tab1 />
                        </ProtectedRoute>
                        <ProtectedRoute exact path="/playlist">
                            <Tab2 />
                        </ProtectedRoute>
                        <ProtectedRoute path="/history">
                            <Tab3 />
                        </ProtectedRoute>
                        <ProtectedRoute path="/profile">
                            <Tab3 />
                        </ProtectedRoute>
                        <ProtectedRoute exact path="/">
                            <Redirect to="/home" />
                        </ProtectedRoute>
                    </IonRouterOutlet>
                    <IonTabBar
                        slot="bottom"
                        hidden={!isSignedIn}
                        className="__ion_tab_bar h-16 bg-[#333]"
                    >
                        <IonTabButton
                            tab="tab-home"
                            href="/home"
                            className="h-16 bg-[#333]"
                        >
                            <HouseSimple weight="bold" size={20} />
                            <IonLabel class="font-bold text-xs">Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton
                            className="h-16 bg-[#333]"
                            tab="tab-playlist"
                            href="/playlist"
                        >
                            <Playlist weight="bold" size={20} />
                            <IonLabel class="font-bold text-xs">
                                Playlist
                            </IonLabel>
                        </IonTabButton>
                        <IonTabButton
                            disabled
                            tab="tab-playing"
                            className="!flex-[0.5] bg-[#333]"
                        ></IonTabButton>
                        <IonTabButton
                            className="h-16 bg-[#333]"
                            tab="tab-history"
                            href="/history"
                        >
                            <Clock weight="bold" size={20} />
                            <IonLabel class="font-bold text-xs">
                                History
                            </IonLabel>
                        </IonTabButton>
                        <IonTabButton
                            className="h-16 bg-[#333]"
                            tab="tab-profile"
                            href="/profile"
                        >
                            <User weight="bold" size={20} />
                            <IonLabel class="font-bold text-xs">
                                Profile
                            </IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
                <IonRouterOutlet hidden={isSignedIn}>
                    <Route exact path="/login">
                        <LoginPage />
                        {isSignedIn && <Redirect to="/" />}
                    </Route>

                    <Route exact path="/register">
                        <RegisterPage />
                        {isSignedIn && <Redirect to="/" />}
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
}

export default App
