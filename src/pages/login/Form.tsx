import { apiLogin } from "@/api"
import CustomIonInput from "@/components/CustomIonInput"
import { useAuthStore } from "@/store/auth.store"
import {
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonList,
    IonRouterLink,
    IonSpinner,
} from "@ionic/react"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type LoginFormInputs = {
    email: string
    password: string
}

export const LoginForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>()

    const authStore = useAuthStore()

    const onSubmit = (data: LoginFormInputs) => mutateLogin(data)

    const { mutate: mutateLogin, isPending: isLoadingLogin } = useMutation({
        mutationFn: apiLogin,
        onSuccess: (data) => {
            console.log(data)
            authStore.setToken(data.accessToken)
            location.href = "/"
        },
        onError: (error) => {
            Promise.reject(error)
        },
    })

    console.log(errors)

    return (
        <>
            <div className="title flex-col-center mb-6">
                <h3 className="font-extrabold">Log In</h3>
                <span className="text-xs font-medium">
                    If You Need Any Support{" "}
                    <IonRouterLink href="/login">Click here</IonRouterLink>
                </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-1"
            >
                <div>
                    <CustomIonInput
                        id="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    <span className="text-red-500 text-sm font-medium ml-2">
                        {errors.email && <span>{errors.email.message}</span>}
                    </span>
                </div>
                <div>
                    <div>
                        <CustomIonInput
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 7,
                                    message:
                                        "Password must be more than 6 characters",
                                },
                            })}
                        >
                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </CustomIonInput>
                        <span className="text-red-500 text-sm font-medium ml-2">
                            {errors.password && (
                                <span>{errors.password.message}</span>
                            )}
                        </span>
                    </div>

                    <div
                        className="underline text-sm font-bold ml-2 mb-2 cursor-pointer"
                        onClick={() => alert("Coming soon")}
                    >
                        Forgot password?
                    </div>
                </div>
                <LoginButton loading={isLoadingLogin} />
            </form>
        </>
    )
}

type LoginButtonProps = {
    loading?: boolean
}

const LoginButton: FC<LoginButtonProps> = ({ loading = false }) => {
    return (
        <button
            type="submit"
            className="h-[56px] flex-center bg-ongakool text-black font-bold rounded-xl w-full cursor-pointer hover:bg-ongakool-hover transition-all ease duration-200"
        >
            {loading ? <IonSpinner /> : "Log In"}
        </button>
    )
}
