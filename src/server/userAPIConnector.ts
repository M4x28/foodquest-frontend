import axios from "axios";
import { UserEndpoint } from "./server";
import { ENDPOINTS } from "../utility/constants";

//WIP

export default class StrapiUserAPI implements UserEndpoint{

    async login(identifier: string, password: string) {
        try {
            const response = await axios.post(ENDPOINTS.USERS.POST_LOGIN, {
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
            const response = await axios.post(ENDPOINTS.USERS.POST_REGISTER, {
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