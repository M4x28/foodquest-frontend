import React, { useEffect, useState } from "react";
import Page from "./Page.tsx";
import Header, { Pages } from "../components/utility/Header.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/card/ProductCard.tsx";
import { ReactComponent as PizzaIcon } from "../assets/pizzaFull.svg";

import "./productPage.css";
import { backendServer } from '../App.tsx';
import { Allergen, DetailProduct, Ingredient } from "../server/server.ts";
import { toErrorPage } from "../utility/generic.ts";

/**
 * Componente per la visualizzazione della pagina dei prodotti per una categoria specifica.
 */
function ProductPage() {
    const navigate = useNavigate(); // Hook per la navigazione
    const { categoryID } = useParams(); // Recupera il parametro `categoryID` dalla route

    // Stati locali per gestire i dati della pagina
    const [catName, setCatName] = useState("Loading..."); // Nome della categoria
    const [products, setProducts] = useState<DetailProduct[]>([]); // Prodotti della categoria
    const [ingredients, setIngredient] = useState<Ingredient[]>([]); // Ingredienti disponibili
    const [allergens, setAllergens] = useState<Allergen[]>([]); // Allergeni disponibili
    const [customizable, setCustomizable] = useState(false); // Flag per prodotti personalizzabili

    // Effettua il fetch dei dettagli della categoria e dei prodotti al caricamento della pagina
    useEffect(() => {
        // Recupera i dettagli della categoria
        backendServer.categories.fetchCatergoryDetail(categoryID || "")
            .then(catDetail => {
                setCatName(catDetail.name); // Imposta il nome della categoria
            })
            .catch((err) => {
                console.log(err); // Logga eventuali errori
                toErrorPage(navigate); // Reindirizza alla pagina di errore
            });

        // Recupera i prodotti della categoria
        backendServer.categories.fetchProductByCategory(categoryID || "")
            .then((catDetail) => {
                setProducts(catDetail.products); // Imposta i prodotti

                // Carica gli ingredienti se necessario
                if (catDetail.hasIg) {
                    backendServer.ingredient.fetchIngredient().then(ig => {
                        setIngredient(ig); // Imposta gli ingredienti
                        setCustomizable(true); // Abilita i prodotti personalizzabili
                    });
                }
            })
            .catch((err) => {
                console.log(err); // Logga eventuali errori
                toErrorPage(navigate); // Reindirizza alla pagina di errore
            });

        // Recupera gli allergeni disponibili
        backendServer.allergen.fetchAllergen()
            .then((res) => {
                setAllergens(res); // Imposta gli allergeni
            })
            .catch((err) => {
                console.log(err); // Logga eventuali errori
                toErrorPage(navigate); // Reindirizza alla pagina di errore
            });
    }, [categoryID]); // Effettua il fetch ogni volta che `categoryID` cambia

    return (
        <Page>
            {/* Intestazione della pagina con il nome della categoria */}
            <Header pageName={catName} current={Pages.Home} />

            {/* Sezione per la visualizzazione dei prodotti */}
            <section className="products">
                {
                    products.map(p => (
                        <ProductCard
                            product={p}
                            key={p.documentId}
                            ingredients={p.ingredientsId
                                ? ingredients.filter(i => p.ingredientsId.includes(i.documentId))
                                : undefined} // Filtra gli ingredienti associati
                            allergens={p.allergensId
                                ? allergens.filter(a => p.allergensId.includes(a.documentId))
                                : undefined} // Filtra gli allergeni associati
                            imgUrl={p.imgUrl
                                ? backendServer.imageUrlFromServer(p.imgUrl, "thumbnail")
                                : undefined} // Recupera l'immagine del prodotto
                            editable={customizable} // Flag per la modifica
                        />
                    ))
                }
            </section>

            {/* Pulsante per creare un prodotto personalizzato, visibile solo se `customizable` è true */}
            {customizable &&
                <section className="create-btn-container">
                    <Link className="dark-btn create-btn" to={"/creazionepizza"}>
                        <PizzaIcon /> {/* Icona della pizza */}
                        Crea la tua pizza
                    </Link>
                </section>
            }
        </Page>
    );
}

export default ProductPage;