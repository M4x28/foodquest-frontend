import axiosInstance from "../utility/axiosInstance.ts";
import { ENDPOINTS } from "../utility/constants.ts";

class UserService {
    async login(identifier: string, password: string) {
        try {
            const response = await axiosInstance.post(ENDPOINTS.USERS.POST_LOGIN, {
                identifier,
                password,
            });
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    async register(username: string, email: string, password: string) {
        try {
            const response = await axiosInstance.post(ENDPOINTS.USERS.POST_REGISTER, {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    }
}
export const userService = new UserService();