import { mainColor } from "@/theme/constant"
import { VinylRecord } from "@phosphor-icons/react"
import React, { FC } from "react"

export type LogoProps = {
    size?: "lg" | "md" | "sm"
    spin?: boolean
    glow?: boolean
}

const iconSizeMap = {
    lg: 128,
    md: 64,
    sm: 32,
}
const fontSizeMap = {
    lg: 80,
    md: 40,
    sm: 20,
}

const Logo: FC<LogoProps> = ({ size = "md", spin = false, glow = false }) => {
    const props = { size, spin, glow }
    return (
        <div className="inline-flex flex-col items-center p-4  cursor-default">
            <LogoIcon {...props} />
            <LogoText {...props} />
        </div>
    )
}

const LogoIcon: FC<LogoProps> = ({ size = "md", spin, glow }) => {
    return (
        <div
            className="flex w-full items-center justify-center"
            style={{
                animation: spin ? "spin 1s linear infinite" : "none",
            }}
        >
            {glow && (
                <span className="m-0 font-black absolute mx-auto flex border w-fit blur-lg bg-clip-text text-6xl box-content text-transparent text-center select-none">
                    <VinylRecord
                        size={iconSizeMap[size]}
                        color={mainColor}
                        weight="bold"
                    />
                </span>
            )}
            <span className="m-0 font-black relative top-0 w-fit h-auto justify-center flex items-center  bg-clip-text text-6xl  text-transparent text-center select-auto">
                <VinylRecord
                    size={iconSizeMap[size]}
                    color={mainColor}
                    weight="bold"
                />
            </span>
        </div>
    )
}

const LogoText: FC<LogoProps> = ({ size = "md", spin, glow }) => {
    return (
        <div className="flex w-full items-center justify-center">
            {glow && (
                <span
                    style={{
                        fontSize: fontSizeMap[size],
                        color: mainColor,
                    }}
                    className="m-0 font-black absolute mx-auto flex border w-fit blur-lg bg-clip-text text-6xl box-content text-transparent text-center select-none"
                >
                    Ongakool
                </span>
            )}
            <h1
                style={{ fontSize: fontSizeMap[size], color: mainColor }}
                className="m-0 font-black relative top-0 w-fit h-auto justify-center flex items-center  bg-clip-text text-6xl  text-transparent text-center select-auto"
            >
                Ongakool
            </h1>
        </div>
    )
}

export default Logo
