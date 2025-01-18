import axios from "axios";
import { UserEndpoint } from "./server";

export default class StrapiUserAPI implements UserEndpoint{

    private __endpoint__:string;

    constructor(serverUrl:string){
        this.__endpoint__ = serverUrl + "/api/auth/local";
    }

    async login(identifier: string, password: string) {
        try {
            const response = await axios.post(this.__endpoint__, {
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
            const response = await axios.post(`${this.__endpoint__}/register`, {
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