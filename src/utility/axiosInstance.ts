import axios from "axios";
import { API_BASE_URL } from "./constants.ts";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
    },
});

export default axiosInstance;