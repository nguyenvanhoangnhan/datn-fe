const configs = {
    BACK_END_URL:
        import.meta.env.VITE_BACK_END_URL || "http://127.0.0.1:8080/api",
    API_TIME_OUT: import.meta.env.VITE_API_TIME_OUT || 60000,
    TOAST_DEFAULT_DURATION: import.meta.env.VITE_TOAST_DEFAULT_DURATION || 3000,
}

export default configs
