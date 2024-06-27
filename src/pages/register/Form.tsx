import CustomIonInput from "@/components/CustomIonInput"
import {
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonList,
    IonRouterLink,
    IonSpinner,
} from "@ionic/react"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { apiRegister } from "@/api"
import { useAuthStore } from "@/store/auth.store"

type RegisterFormInputs = {
    email: string
    fullname: string
    password: string
    passwordConfirm: string
}

export const RegisterForm: FC = () => {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>()

    const authStore = useAuthStore()

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        mutateRegister({
            email: data.email,
            fullname: data.fullname,
            password: data.password,
        })
    }

    const { mutate: mutateRegister, isPending: isLoadingRegister } =
        useMutation({
            mutationFn: apiRegister,
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
                <h3 className="font-extrabold">Register</h3>
                <span className="text-xs font-medium">
                    If You Need Any Support{" "}
                    <IonRouterLink href="/register">Click here</IonRouterLink>
                </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-1"
            >
                <div>
                    <CustomIonInput
                        id="fullname"
                        placeholder="Full Name"
                        {...register("fullname", {
                            required: "Full name is required",
                        })}
                    />
                    <span className="text-red-500 text-sm font-medium ml-2">
                        {errors.fullname && (
                            <span>{errors.fullname.message}</span>
                        )}
                    </span>
                </div>
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
                </div>
                <div>
                    <div>
                        <CustomIonInput
                            id="passwordConfirm"
                            type="password"
                            placeholder="Repeat Password"
                            {...register("passwordConfirm", {
                                required: "This field is required",
                                validate: (value) =>
                                    value === watch("password") ||
                                    "The passwords do not match",
                            })}
                        >
                            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </CustomIonInput>
                        <span className="text-red-500 text-sm font-medium ml-2">
                            {errors.passwordConfirm && (
                                <span>{errors.passwordConfirm.message}</span>
                            )}
                        </span>
                    </div>
                </div>
                <RegisterSubmitBtn loading={isLoadingRegister} />
            </form>
        </>
    )
}

type RegisterSubmitBtnProps = {
    loading?: boolean
}

const RegisterSubmitBtn: FC<RegisterSubmitBtnProps> = ({ loading = false }) => {
    return (
        <button
            type="submit"
            className="p-4 bg-ongakool text-black font-bold rounded-xl w-full cursor-pointer hover:bg-ongakool-hover transition-all ease duration-200"
        >
            {loading ? <IonSpinner /> : "Register"}
        </button>
    )
}
