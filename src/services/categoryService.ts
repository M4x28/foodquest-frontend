import axiosInstance from "../utility/axiosInstance.ts";
import { ENDPOINTS } from "../utility/constants.ts";

export const getCategoriesIdAndName = async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORY.GET_CATEGORIES.concat('?fields=documentId%2C%20Name'));
    return response.data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.Name,
    }));
};