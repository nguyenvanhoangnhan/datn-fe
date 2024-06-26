import Logo from "@/components/Logo"
import React, { FC } from "react"

export type LoadingPageProps = {
    // Define your props here if needed
}

const LoadingPage: FC<LoadingPageProps> = ({}) => {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Logo size="md" spin glow />
        </div>
    )
}

export default LoadingPage
