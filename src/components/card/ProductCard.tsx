import React, { useContext, useState } from "react";
import AnimatedButton from "../input/AnimatedButton.tsx";
import { Link, useNavigate } from "react-router-dom";

// Import delle immagini e icone
import placeholder from "../../assets/pizzaPlacehoder.webp";
import { ReactComponent as DownIcon } from "../../assets/down.svg";
import { ReactComponent as UpIcon } from "../../assets/up.svg";
import { ReactComponent as CartIcon } from "../../assets/shoppingCart.svg";
import { ReactComponent as TicIcon } from "../../assets/tic.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";

import "./productCard.css";
import { AppStateCtx } from "../../App.tsx";
import { formatPrice, toErrorPage } from "../../utility/generic.ts";
import CollapseElement from "../utility/CollapseElement.tsx";
import { Allergen, Ingredient, Product } from "../../server/server.ts";
import { backendServer } from '../../App.tsx';

interface PropType {
    product: Product;           //product detail
    editable?: boolean;         //The product can be edited
    imgUrl?: string;            //Image url, uses placeholder if none passed
    ingredients?: Ingredient[]; //Product Ingredient List if any
    allergens?: Allergen[];     //Product allergen list if any
}

/**
 * Componente per rappresentare una scheda prodotto.
 * 
 * @param {Product} product - Dati del prodotto.
 * @param {Ingredient[]} [ingredients] - Lista degli ingredienti.
 * @param {Allergen[]} [allergens] - Lista degli allergeni.
 * @param {boolean} [editable] - Abilita la modifica del prodotto.
 * @param {string} [imgUrl] - URL immagine del prodotto (default: placeholder).
 */
function ProductCard({ product, ingredients, allergens, editable, imgUrl = placeholder}: PropType) {
    
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);
    const [showAllergen, setShowAllergen] = useState(false);

    //Generate list of ingredient as description if any are present
    let description = "";
    if (ingredients) {
        description = ingredients
            .sort((a, b) => -a.type.localeCompare(b.type))      //Order by type
            .reduce((desc, ig) => desc + ig.name + ", ", ""); 
    }

    function toggleAllergen() {
        setShowAllergen(s => !s);
    }

    //Add product to the cart
    function buyItem() {
        backendServer.products.addProductToCart(
            appState.table,
            product.documentId,
            appState.user ? appState.user.user.documentId : undefined //If present add the user detail for FC
        ).then(() => {
            console.log(product.name, "Acquistata");
        }).catch((err) => {
            console.log("Error:\n", err);
            toErrorPage(navigate);
        });
    }

    return (
        <div className="my-card">
            <div className="product-header">
                <img src={imgUrl} alt="Foto del prodotto" />
                <h3 className="product-name luckiest-font">{product.name}</h3>
                <h3 className="product-price">{formatPrice(product.price)} €</h3>
            </div>

            {description && <p className="product-description">{description}</p>}

            <div className="product-buttons">
                <button className="allergen-btn" onClick={toggleAllergen}>
                    {showAllergen ? <DownIcon /> : <UpIcon />} Allergeni
                </button>

                <AnimatedButton
                    className={editable ? "buy-btn" : "buy-btn double-col-size"}
                    animationClass="buy-anim"
                    OnClick={buyItem}
                >
                    <CartIcon className="cart-icon" />
                    <TicIcon className="tic-icon" />
                </AnimatedButton>

                {editable && (
                    <Link className="edit-btn" to={"/creazionepizza/".concat(product.documentId)}>
                        <EditIcon /> Modifica
                    </Link>
                )}
            </div>

            <CollapseElement open={showAllergen} className="product-allergen">
                {allergens && allergens?.length > 0 ? (
                    <ul>
                        {allergens.map(a => (
                            <li key={a.documentId}>{a.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nessun allergene comune presente</p> // Default message for no allergen
                )}
            </CollapseElement>
        </div>
    );
}

export default ProductCard;