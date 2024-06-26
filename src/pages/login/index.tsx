import Logo from "@/components/Logo"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import { LoginForm } from "./Form"
import { IonRouterLink } from "@ionic/react"

export type LoginPageProps = {
    // Define your props here if needed
}

const LoginPage: FC<LoginPageProps> = ({}) => {
    return (
        <div className="__login w-screen h-screen flex flex-col pt-8">
            <div className="__login__upper py-2 flex-center">
                <Logo size="sm" />
            </div>

            <div className="__login__middle flex-1 flex-col-center py-4 px-10">
                <LoginForm />
                <ToRegister />
            </div>

            <div className="__login__lower">{/* Nothing here */}</div>
        </div>
    )
}

const ToRegister = () => (
    <>
        <div className="w-full flex-center relative h-12">
            <div className="bg-gray-400 w-full h-[1px] absolute"></div>
            <div className="text-white text-sm bg-black absolute px-3">Or</div>
        </div>
        <IonRouterLink
            href="/register"
            className="text-xs font-bold hover:!underline"
        >
            <span className="text-white">Don't Have An Account?</span> Register
        </IonRouterLink>
    </>
)

export default LoginPage
