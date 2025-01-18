import React, { useEffect, useState } from "react";
import Page from "./Page.tsx";
import Header, { Pages } from "../components/utility/Header.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/card/ProductCard.tsx";

import { ReactComponent as PizzaIcon } from "../assets/pizzaFull.svg"

import "./productPage.css"
import { backendServer } from '../App.tsx';
import { allergen, detailProduct, ingredient} from "../server/server.ts";
import { toErrorPage } from "../utility/generic.ts";

function ProductPage(){

    const navigate = useNavigate();

    const { categoryID } = useParams();
    const [catName,setCatName] = useState("Loading...");
    const [products,setProducts] = useState<detailProduct[]>([]);
    const [ingredients,setIngredient] = useState<ingredient[]>([]);
    const [allergens,setAllergens] = useState<allergen[]>([]);
    const [customizable,setCustomizable] = useState(false)

    //Fetch on page load all category detail
    useEffect(() => {

        //Fetch Category name
        backendServer.categories.fetchCatergoryDetail(categoryID || "")
        .then(catDetail => {
            setCatName(catDetail.name);
            
        }).catch((err) => {
            console.log(err);
            toErrorPage(navigate);
        });

        //Fetch product
        backendServer.categories.fetchProductByCategory(categoryID || "")
        .then((catDetail) => {
            
            setProducts(catDetail.products);

            //Load ingredients if needed
            if(catDetail.hasIg){
                backendServer.fetchIngredient().then(ig => {
                    setIngredient(ig);
                    setCustomizable(true);
                })
            }

        }).catch((err) => {
            console.log(err);
            toErrorPage(navigate);
        });
        
        //Fetch Allergen
        backendServer.fetchAllergen()
            .then((res) => {
                setAllergens(res)
            }).catch((err) => {
                console.log(err);
                toErrorPage(navigate);
            });
        
    },[categoryID]);

    return(
        <Page>
            <Header pageName={catName} current={Pages.Home}/>
            <section className="products">
                {
                    products.map(p => <ProductCard 
                        product={p} key={p.documentId}
                        ingredients={p.ingredientsId ? ingredients.filter(i => p.ingredientsId.includes(i.documentId)) : undefined }
                        allergens={p.allergensId ? allergens.filter(a => p.allergensId.includes(a.documentId)) : undefined }
                        imgUrl={p.imgUrl ? backendServer.imageUrlFromServer(p.imgUrl,"thumbnail") : undefined} editable={customizable}/>)
                }
            </section>
            { customizable && 
                <section className="create-btn-container">
                    <Link className="dark-btn create-btn" to={"/creazionepizza"} >
                        <PizzaIcon/>
                        Crea la tua pizza
                    </Link>
                </section>
            }
        </Page>
    );

}

export default ProductPage;