import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { FCEndpoint, FidelityCard } from "./server";

export default class StrapiFCAPI implements FCEndpoint {
    private __endpoint__: string;

    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/fidelity-card";
    }

    // Recupera la fidelity card di un utente
    async fetchUserFC(userID: string): Promise<FidelityCard> {
        const response = await AxiosSingleton.getInstance().get(`${this.__endpoint__}/${userID}`);
        //console.log("FC:", response.data.data);
        return response.data.data;
    }

    // Imposta lo stato di utilizzo dei punti
    async setPointUsage(userID: string, isUsingPoint: boolean): Promise<void> {
        const response = await AxiosSingleton.getInstance().put(`${this.__endpoint__}/use-points`, {
            data: {
                users_permissions_user: userID,
                usePoints: isUsingPoint,
            },
        });
        //console.log("Now ", userID, (isUsingPoint ? "is" : "is not") + " using Points");
        return response.data;
    }

    // Aggiunge punti fedeltà in base ai prodotti acquistati
    async addFidelityPoints(userID: string, productIDs: string[]): Promise<void> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/add-points`, {
            data: {
                users_permissions_user: userID,
                productIDs: productIDs,
            },
        });
        //console.log("Fidelity points added for", userID, "with products", productIDs);
        return response.data;
    }

    // Calcola lo sconto totale per un tavolo dato un array di utenti
    async calculateTableDiscount(tableNumber: number): Promise<number> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/calculate-discount`, {
            data: {
                number: tableNumber,
            },
        });
        //console.log("Table discount calculated for users", users, response.data.discount);
        return response.data.discount;
    }

    // Crea una nuova fidelity card per un utente
    async createFidelityCard(userID: string): Promise<FidelityCard> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/create`, {
            users_permissions_user: userID,
        });
        //console.log("Fidelity card created for", userID, response.data.data);
        return response.data.data;
    }

    // Elimina la fidelity card di un utente
    async deleteFidelityCard(userID: string): Promise<void> {
        const response = await AxiosSingleton.getInstance().delete(`${this.__endpoint__}/delete`, {
            data: {
                users_permissions_user: userID,
            },
        });
        //console.log("Fidelity card deleted for", userID);
        return response.data;
    }

    // Resetta a 0 i punti di un array di utenti se UsePoints è settato a 1
    async resetPoints(users: string[]): Promise<void> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/reset-points`, {
            data: {
                users_permissions_user: users,
            },
        });
        //console.log("Points reset for users", users);
        return response.data;
    }
}