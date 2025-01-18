export const API_BASE_URL = "http://localhost:1337/api";

export const ENDPOINTS = {
    USERS: {
        POST_LOGIN: "/auth/local",
        POST_REGISTER: "/auth/local/register",
    },

    CATEGORY: {
        GET_CATEGORIES: "/categories",
    }, 

    INGREDIENTS: {
        GET_INGREDIENTS: "/ingredients",
    },

    PRODUCT: {
        POST_PRODUCT: "/products/create",
        GET_PRODUCTS: "/products"
    }
    
};