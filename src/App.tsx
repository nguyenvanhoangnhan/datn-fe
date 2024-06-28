import { Redirect, Route } from "react-router-dom"
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterContext,
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
import TabHome from "./pages/home"
import TabPlaylist from "./pages/playlist"
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
import "./theme/common.less"

import LoadingPage from "./pages/LoadingPage"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AsyncErrorBoundary from "./components/AsyncErrorBoundary"
import PlaylistDetail from "./pages/playlist/detail"
import LogOutHandlePage from "./pages/logout"
import ArtistPage from "./pages/artist"
import Search from "./pages/search"
import TabProfile from "./pages/profile"
import TabHistory from "./pages/history"
import AlbumDetail from "./pages/album"

const queryClient = new QueryClient()

setupIonicReact()

const App: React.FC = () => {
    const store = useAuthStore()
    const isIos = isPlatform("ios")

    const [showLoading, setShowLoading] = useState(true)

    useEffect(() => {
        async function initial() {
            try {
                await store.persistAuth()
            } finally {
                setTimeout(() => {
                    setShowLoading(false)
                }, 1000)
            }
        }

        initial()

        console.log(store)
    }, [])

    const isSignedIn = useMemo(() => store.signedIn(), [store])

    console.log("isSignedIn", isSignedIn)

    return (
        <QueryClientProvider client={queryClient}>
            <IonApp>
                <AsyncErrorBoundary>
                    {showLoading && <LoadingPage />}
                    <TriggerPlayingMenuButton />

                    <Playing />
                    <IonReactRouter>
                        {isSignedIn && (
                            <IonTabs>
                                <IonRouterOutlet className="!overflow-y-scroll">
                                    <ProtectedRoute exact path="/home">
                                        <TabHome />
                                    </ProtectedRoute>
                                    <ProtectedRoute exact path="/playlist">
                                        <TabPlaylist />
                                    </ProtectedRoute>
                                    <ProtectedRoute path="/history">
                                        <TabHistory />
                                    </ProtectedRoute>
                                    <ProtectedRoute path="/profile">
                                        <TabProfile />
                                    </ProtectedRoute>
                                    <ProtectedRoute exact path="/">
                                        <Redirect to="/home" />
                                    </ProtectedRoute>
                                    <Route
                                        path="/playlist/detail/:playlistId"
                                        component={PlaylistDetail}
                                    />

                                    <Route
                                        path="/logout"
                                        component={LogOutHandlePage}
                                    />
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
                                        <IonLabel class="font-bold text-xs">
                                            Home
                                        </IonLabel>
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
                        )}
                        <Route
                            path="/home/artist/:artistId"
                            component={ArtistPage}
                        />
                        <Route
                            path="/home/album/:albumId"
                            component={AlbumDetail}
                        />
                        <Route path="/home/search" component={Search} />
                        {!isSignedIn && <Redirect to="/login" />}

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
                </AsyncErrorBoundary>
            </IonApp>
        </QueryClientProvider>
    )
}

export default App
