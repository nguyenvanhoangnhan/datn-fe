import Logo from "@/components/Logo"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import { RegisterForm } from "./Form"
import { IonRouterLink } from "@ionic/react"

export type RegisterPageProps = {
    // Define your props here if needed
}

const RegisterPage: FC<RegisterPageProps> = ({}) => {
    return (
        <div className="__register w-screen h-screen flex flex-col pt-8">
            <div className="__register__upper py-2 flex-center">
                <Logo size="sm" />
            </div>

            <div className="__register__middle flex-1 flex-col-center py-4 px-10">
                <RegisterForm />
                <ToLogin />
            </div>

            <div className="__register__lower">{/* Nothing here */}</div>
        </div>
    )
}

const ToLogin = () => (
    <>
        <div className="w-full flex-center relative h-12">
            <div className="bg-gray-400 w-full h-[1px] absolute"></div>
            <div className="text-white text-sm bg-black absolute px-3">Or</div>
        </div>
        <IonRouterLink
            href="/login"
            className="text-xs font-bold hover:!underline"
        >
            <span className="text-white">Have An Account?</span> Login
        </IonRouterLink>
    </>
)

export default RegisterPage
