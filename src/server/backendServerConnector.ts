import axios from "axios";
import Server, { allergen, Category, detailProduct, ImgSize, ingredient, order, table } from "./server";

export default class StrapiServerConnector implements Server{

    private __serverUrl__:string;

    constructor(url:string){
        this.__serverUrl__ = url;
    }

    get serverUrl():string{
        return this.__serverUrl__;
    }

    imageUrlFromServer(url:string,size?:ImgSize):string{
        return `${this.__serverUrl__}/uploads/${size ? size + "_" : ""}${url}`;
    }
    

    async fetchTableStatus(table: table):Promise<string>{
        return await axios.post(`${this.__serverUrl__}/api/table/status`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        }).then((res) => res.data);
    }

    async fetchIngredient():Promise<ingredient[]>{
        const ig:ingredient[] = await axios.get(`${this.__serverUrl__}/api/ingredients`)
            .then((res) => res.data.data.map( i => ({
                documentId:i.documentId,
                type:i.Type,
                name:i.Name,
                price:i.Price
            })));
        console.log("Fetched Ingredient",ig);
        return ig;
    }

    async fetchAllergen():Promise<allergen[]>{
        const allergens:allergen[] = await axios.get(`${this.__serverUrl__}/api/allergens`)
            .then((res) => res.data.data.map(a => ({
                documentId: a.documentId,
                name: a.Name
            })));

        console.log("Fetched Allergen",allergens);
        return allergens;
    }

    async fetchProductByCategory(categoryId: string):Promise<{ name: string; products: detailProduct[]; hasIg:boolean }>{
        
        const catDetail = await axios.get(`${this.__serverUrl__}/api/categories/${categoryId}`)
            .then((res) => {
                const {Name,products} = res.data.data;

                const prods:detailProduct[] = products.map((p) => ({
                    documentId: p.documentId,
                    name: p.Name,
                    price: p.Price,
                    imgUrl:p.image,
                    ingredientsId: p.ingredients,
                    allergensId: p.allergens, 
                }));
                const prodWithIg = prods.filter((p) => p.ingredientsId !== undefined).length;

                return {
                    name:Name,
                    products:prods,
                    hasIg: prodWithIg !== 0
                }
            })

        console.log("Fetched Product for " + catDetail.name,catDetail.products);    
        return catDetail;
    }

    addProductToCart(table: table, productId: string):Promise<void>{
        return axios.post(`${this.__serverUrl__}/api/partial-orders`,{ data: {
            productID: productId,
            accessCode: table.accessCode,
            sessionCode: table.sessionCode
        }})
    };

    private lastOrderFetch:string;
    private chachedOrders:order[];

    fetchOrdersDone(table: table):Promise<order[]>{
        return axios.post(`${this.__serverUrl__}/api/order/get_orders`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
                editedAfter: this.lastOrderFetch,
            }
        }).then((res) => {

            if(!res.data.meta.edited){
                console.log("Order unchanged since",this.lastOrderFetch);
                return this.chachedOrders;
            }

            const orders:order[] = res.data.data.map( o => {
                
                const prods = o.products.map(p => ({
                    documentId:p.documentId,
                    name: p.Name,
                    price: p.Price,
                }));

                return {...o, products:prods};
            })
            
            console.log("Order changed",orders);

            //Sort order based on status
            orders.sort((a,b) => {
                if (a.status === 'Done') {
                    return -1;
                }
                if (b.status === 'Done') {
                    return 1;
                }
                return a.time - b.time;
            });

            this.lastOrderFetch = new Date().toISOString();
            this.chachedOrders = orders;

            return orders;
        });
    }

    askForCheck (table: table):Promise<void>{
        return axios.post(`${this.__serverUrl__}/api/table/checkRequest`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        });
    };

    fetchTotal (table: table) :Promise<{ total: number; discount: number; }>{
        return axios.get(`${this.__serverUrl__}/api/table/total/${table.accessCode}`)
            .then(res => res.data.data);
    }

    fetchCategoriesIdAndName():Promise<Category[]>{
        return axios.get(`${this.__serverUrl__}/api/categories?fields=documentId%2C%20Name`)
            .then( response =>
                response.data.data.map((item: any) => ({
                    id: item.id,
                    documentId: item.documentId,
                    name: item.Name,
                }))
            );
    };
}