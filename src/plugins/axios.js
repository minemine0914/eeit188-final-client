import axios from "axios";
import router from "@/router";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Add a response interceptor
api.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        console.log("HAHA");

        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response.status === 401) {
            console.log(
                "[Axios response inspector] Detect status code 401, take you to login page."
            );
            router.push("/login");
        }
        // Return other status error
        return Promise.reject(error);
    }
);

export default api;
