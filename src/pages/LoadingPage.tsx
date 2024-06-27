import Logo from "@/components/Logo"
import React, { FC } from "react"

export type LoadingPageProps = {
    // Define your props here if needed
}

const LoadingPage: FC<LoadingPageProps> = ({}) => {
    return (
        <div className="w-screen fixed top-0 left-0 z-[9999] h-screen flex items-center justify-center bg-black">
            <Logo size="md" spin glow />
        </div>
    )
}

export default LoadingPage
