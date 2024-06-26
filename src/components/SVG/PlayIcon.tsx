import React, { FC } from "react"

export type PlayIconProps = {
    fill?: string
}

const PlayIcon: FC<PlayIconProps> = ({ fill = "white" }) => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.4933 28.3734C9.44001 28.3734 8.44001 28.12 7.56001 27.6134C5.48001 26.4134 4.33334 23.9734 4.33334 20.76V11.2534C4.33334 8.02669 5.48001 5.60003 7.56001 4.40003C9.64001 3.20003 12.32 3.42669 15.12 5.04003L23.3467 9.78669C26.1333 11.4 27.68 13.6134 27.68 16.0134C27.68 18.4134 26.1467 20.6267 23.3467 22.24L15.12 26.9867C13.5067 27.9067 11.9333 28.3734 10.4933 28.3734Z"
                fill={fill}
            />
        </svg>
    )
}

export default PlayIcon
