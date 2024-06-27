import React, { FC } from "react"

export type SmallPlayProps = {
    // Define your props here if needed
}

const SmallPlay: FC<SmallPlayProps> = ({}) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 20C4.48372 20 0 15.5163 0 10C0 4.48372 4.48372 0 10 0C15.5163 0 20 4.48372 20 10C20 15.5163 15.5163 20 10 20Z"
                fill="#818181"
            />
            <path
                d="M8.84662 14.0651C8.45592 14.0651 8.09313 13.9721 7.76755 13.7861C7.02337 13.3582 6.59546 12.4837 6.59546 11.3768V8.62327C6.59546 7.5256 7.02337 6.64187 7.76755 6.21397C8.51174 5.78606 9.47918 5.85118 10.4373 6.40932L12.828 7.78606C13.7769 8.3349 14.3257 9.1442 14.3257 10C14.3257 10.8558 13.7769 11.6651 12.828 12.214L10.4373 13.5907C9.89778 13.907 9.34895 14.0651 8.84662 14.0651Z"
                fill="#F3F3F3"
            />
        </svg>
    )
}

export default SmallPlay
