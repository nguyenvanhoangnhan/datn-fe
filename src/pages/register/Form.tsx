import CustomIonInput from "@/components/CustomIonInput"
import {
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonList,
    IonRouterLink,
} from "@ionic/react"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type RegisterFormInputs = {
    email: string
    fullname: string
    password: string
    passwordConfirm: string
}

export const RegisterForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>()

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        alert("Submit")
        console.log(data)
        // Handle form submission here
    }

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
                                    value === "password" ||
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
                <RegisterSubmitBtn />
            </form>
        </>
    )
}

type RegisterSubmitBtnProps = {
    // Define your props here if needed
}

const RegisterSubmitBtn: FC<RegisterSubmitBtnProps> = ({}) => {
    return (
        <button
            type="submit"
            className="p-4 bg-ongakool text-black font-bold rounded-xl w-full cursor-pointer hover:bg-ongakool-hover transition-all ease duration-200"
        >
            Register
        </button>
    )
}
