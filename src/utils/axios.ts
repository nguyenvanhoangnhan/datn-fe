import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import configs from "./configs"
import { Preferences } from "@capacitor/preferences"

const axiosClient = axios.create({
    baseURL: configs.BACK_END_URL,
    timeout: Number(configs.API_TIME_OUT),
})

axiosClient.interceptors.request.use(
    async (config) => {
        const accessToken = await Preferences.get({
            key: "accessToken",
        })

        if (accessToken?.value) {
            config.headers.Authorization = `Bearer ${accessToken.value}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const resp = error.response as any
        const respErrorCode = resp?.status ?? 500
        if (respErrorCode === 401) {
            await Preferences.remove({ key: "accessToken" })
        }
        const respErrorMessage =
            resp?.data?.error ?? resp?.data?.message ?? "UNKNOWN_ERROR"

        throw new Error(respErrorMessage)
    }
)

export function $post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.post<T, R>(url, data, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

export function $get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.get<T, R>(url, config)
    } catch (error) {
        console.log("here here")
        return Promise.reject(error)
    }
}

export function $put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.put<T, R>(url, data, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

export function $patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.patch<T, R>(url, data, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

export function $delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
): Promise<R> {
    try {
        return axiosClient.delete<T, R>(url, config)
    } catch (error) {
        return Promise.reject(error)
    }
}

export { axiosClient as api }
