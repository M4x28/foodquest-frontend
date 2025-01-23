import React, { useEffect, useState } from "react";
import Page from "./Page.tsx";
import Header, { Pages } from "../components/utility/Header.tsx";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/card/ProductCard.tsx";
import { ReactComponent as PizzaIcon } from "../assets/pizzaFull.svg";

import "./productPage.css";
import { backendServer } from '../App.tsx';
import { Allergen, DetailProduct, Ingredient } from "../server/server.ts";
import { toErrorPage } from "../utility/generic.ts";
import { Button } from "../components/input/Button.tsx";

/**
 * Componente per la visualizzazione della pagina dei prodotti per una categoria specifica.
 */
function ProductPage() {
    const navigate = useNavigate();
    const { categoryID } = useParams(); //Fetch categoryID from the url

    const [catName, setCatName] = useState("Loading...");           // Category Name (For page title)
    const [products, setProducts] = useState<DetailProduct[]>([]);  // Products to show
    const [ingredients, setIngredient] = useState<Ingredient[]>([]);// All Ingredient
    const [allergens, setAllergens] = useState<Allergen[]>([]);     // All Allergen
    const [customizable, setCustomizable] = useState(false);        // Product allow customization (The product have ingredient)

    useEffect(() => {
        
        //Fetch category detail
        backendServer.categories.fetchCatergoryDetail(categoryID || "")
            .then(catDetail => {
                setCatName(catDetail.name);
            })
            .catch((err) => {
                console.log(err);
                toErrorPage(navigate);
            });

        //Fetch all product for that category
        backendServer.categories.fetchProductByCategory(categoryID || "")
            .then((catDetail) => {
                setProducts(catDetail.products);

                // If any product as ingredients then fetch them from backend
                if (catDetail.hasIg) {
                    backendServer.ingredient.fetchIngredient().then(ig => {
                        setIngredient(ig);
                        // Presence of ingredient means that product in the category are customizable
                        setCustomizable(true);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toErrorPage(navigate);
            });

        // Fetch all allegen 
        // Fetching whitout checking if needed because they are few and is very unlikely that they are not needed
        // Doing so allow to fetch allergen while fetching other stuff
        backendServer.allergen.fetchAllergen()
            .then((res) => {
                setAllergens(res);
            })
            .catch((err) => {
                console.log(err);
                toErrorPage(navigate);
            });
    }, [categoryID]);

    return (
        <Page>
            <Header pageName={catName} current={Pages.Home} />

            <section className="products">
                {
                    products.map(p => (
                        <ProductCard
                            product={p}
                            key={p.documentId}
                            ingredients={p.ingredientsId
                                ? ingredients.filter(i => p.ingredientsId.includes(i.documentId))
                                : undefined} //Fetch Ingeredients from batched ingredient
                            allergens={p.allergensId
                                ? allergens.filter(a => p.allergensId.includes(a.documentId))
                                : undefined} //Fetch Allergena from batched allergen
                            imgUrl={p.imgUrl
                                ? backendServer.imageUrlFromServer(p.imgUrl, "thumbnail")
                                : undefined} //If is present send img url
                            editable={customizable}
                        />
                    ))
                }
            </section>

            {customizable &&
                <section className="create-btn-container">
                    <Button className="create-btn" variant="success" 
                        onClick={() => navigate("/creazionepizza")}>
                        <PizzaIcon />
                        Crea la tua pizza
                    </Button>
                </section>
            }
        </Page>
    );
}

export default ProductPage;