import React, { useContext, useState } from "react";
import AnimatedButton from "../input/AnimatedButton.tsx";
import { Link, useNavigate } from "react-router-dom";

import placeholder from "../../assets/pizzaPlacehoder.webp";
import { ReactComponent as DownIcon} from "../../assets/down.svg";
import { ReactComponent as UpIcon} from "../../assets/up.svg";
import { ReactComponent as CartIcon } from "../../assets/shoppingCart.svg"
import { ReactComponent as TicIcon } from "../../assets/tic.svg"
import { ReactComponent as EditIcon } from "../../assets/edit.svg"

import "./productCard.css";
import { AppStateCtx } from "../../App.tsx";
import { formatPrice, toErrorPage } from "../../utility/generic.ts";
import CollapseElement from "../utility/CollapseElement.tsx";
import { allergen, ingredient, product } from "../../server/server.ts";
import { backendServer } from '../../App.tsx';

interface PropType{
    product:product
    editable?:boolean;
    imgUrl?:string,
    ingredients?:ingredient[];
    allergens?:allergen[];
    setErr?:Function;
}

function ProductCard({product,ingredients,allergens,editable, imgUrl = placeholder, setErr}:PropType){

    const navigate = useNavigate();

    //eslint-disable-next-line
    const [appState,_] = useContext(AppStateCtx);
    const [showAllergen,setShowAllergen] = useState(false);

    let description = "";
    if(ingredients){
        description = ingredients.sort((a,b) => -a.type.localeCompare(b.type))
            .reduce((desc,ig) => desc + ig.name + ", ","")
    }

    function toggleAllergen(){
        setShowAllergen(s => !s)
    }

    function buyItem(){
        backendServer.products.addProductToCart(appState.table,product.documentId)
        .then(() => {
            console.log(product.name, "Acquistata");
        }).catch((err) => {
            toErrorPage(navigate);
            console.log("Error:\n",err)
        })
    }

    return(
        <div className="my-card">
            <div className="product-header">
                <img src={imgUrl} alt="Foto del prodotto"/>
                <h3 className="product-name">{product.name}</h3>
                <h3 className="product-price">{formatPrice(product.price)} €</h3>
            </div>
            { description && <p className="product-description">{description}</p> }
            <div className="product-buttons">
                <button className="allergen-btn" onClick={toggleAllergen}> 
                    {showAllergen ? <DownIcon/> : <UpIcon/>} Allergeni 
                </button>
                <AnimatedButton className={editable ? "buy-btn" : "buy-btn double-col-size"} 
                    animationClass="buy-anim" OnClick={buyItem}>
                    <CartIcon className="cart-icon"/>
                    <TicIcon className="tic-icon"/>
                </AnimatedButton>
                {editable && <Link className="edit-btn"> 
                   <EditIcon/> Modifica 
                </Link>}
            </div>
            <CollapseElement open={showAllergen} className="product-allergen">
                {allergens && allergens?.length > 0 ?
                    <ul>
                        {allergens.map(a => 
                            <li key={a.documentId}>{a.name}</li>
                        )}           
                    </ul>
                    :    
                    <p>Nessun allergene comune presente</p>
                }
            </CollapseElement>
        </div>
    )
}

export default ProductCard;