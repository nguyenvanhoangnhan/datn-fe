import { IonInput } from "@ionic/react"
import React, {
    ForwardRefExoticComponent,
    HTMLAttributes,
    forwardRef,
} from "react"
import { JSX } from "@ionic/core"
import "./style.less"

type IonInputProps = JSX.IonInput &
    Omit<HTMLAttributes<HTMLIonInputElement>, "styles">

export interface CustomIonInputProps extends IonInputProps {
    // Define your props here if needed
}

const CustomIonInput = forwardRef<HTMLIonInputElement, CustomIonInputProps>(
    function (props, ref) {
        const { className } = props

        return (
            <IonInput
                {...props}
                className={`custom-ion-input ${className}`}
                ref={ref}
            />
        )
    }
)

export default CustomIonInput
