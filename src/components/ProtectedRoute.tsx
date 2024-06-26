import { useAuthStore } from "@/store/auth.store"
import { PropsWithChildren, useEffect } from "react"
import { Redirect, Route } from "react-router"

interface ProtectedRouteProps extends PropsWithChildren {
    path: string
    exact?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    path,
    exact = false,
    children,
}) => {
    const isSignedIn = useAuthStore((state) => state.signedIn())

    useEffect(() => {
        console.log(`Loading protected route '${path}'`)
        console.log(
            `Is signed in? ${isSignedIn} -> ${
                !isSignedIn ? "redirect to login" : "show page"
            }`
        )
    }, [children, path])

    return (
        <Route exact={exact} path={path}>
            {isSignedIn ? children : <Redirect to="/login" />}
        </Route>
    )
}
