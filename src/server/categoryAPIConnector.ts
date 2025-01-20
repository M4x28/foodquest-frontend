import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { Category, CategoryEndpoint, DetailProduct } from "./server.ts";

export default class StrapiCategoryAPI implements CategoryEndpoint{

    private __endpoint__ : string;

    constructor(serverUrl:string){
        this.__endpoint__ = serverUrl + "/api/categories";
    }

    async fetchProductByCategory(categoryId: string):Promise<{products: DetailProduct[]; hasIg:boolean }>{
        
        const catDetail = await AxiosSingleton.getInstance().get(`${this.__endpoint__}/all/${categoryId}`)
            .then((res) => {
                const products = res.data.data;

                const prods:DetailProduct[] = products.map((p) => ({
                    documentId: p.documentId,
                    name: p.Name,
                    price: p.Price,
                    imgUrl:p.image,
                    ingredientsId: p.ingredients,
                    allergensId: p.allergens, 
                }));
                const prodWithIg = prods.filter((p) => p.ingredientsId !== undefined).length;

                return {
                    products:prods,
                    hasIg: prodWithIg !== 0
                }
            })

        console.log("Fetched Product for " + categoryId,catDetail.products);    
        return catDetail;
    }

    fetchCategoriesIdAndName():Promise<Category[]>{
        return AxiosSingleton.getInstance().get(`${this.__endpoint__}?fields=documentId%2C%20Name`)
            .then( response =>
                response.data.data.map((item: any) => ({
                    id: item.id,
                    documentId: item.documentId,
                    name: item.Name,
                }))
            );
    }

    async fetchCatergoryDetail(categoryId: string):Promise<{ documentId: string; name: string; }>{
        return await AxiosSingleton.getInstance().get(`${this.__endpoint__}/${categoryId}`)
            .then(res => {
                const category = res.data.data;

                console.log(category);
                return{
                    documentId: category.documentId,
                    name: category.Name
                }
            });
    };

    async getPizzaCategoryId(): Promise<string | undefined> {
        // Fetch delle categorie
        const categories = await this.fetchCategoriesIdAndName();

        // Filtra la categoria con nome 'pizza' (ignora maiuscole/minuscole)
        const pizzaCategory = categories.find(
            (category) => category.name.toLowerCase() === "pizza"
        );

        // Restituisci solo il documentId, oppure undefined se non trovato
        return pizzaCategory ? pizzaCategory.documentId : undefined;
    }
}