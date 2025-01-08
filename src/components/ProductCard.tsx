import React, { useContext, useState } from "react";
import AnimatedButton from "./AnimatedButton.tsx";
import { Link } from "react-router-dom";

import axios from "axios";
import { backendUrl } from "../utility/constants.ts";

import placeholder from "../assets/pizzaPlacehoder.webp";
import { ReactComponent as DownIcon} from "../assets/down.svg";
import { ReactComponent as UpIcon} from "../assets/up.svg";
import { ReactComponent as CartIcon } from "../assets/shoppingCart.svg"
import { ReactComponent as TicIcon } from "../assets/tic.svg"
import { ReactComponent as EditIcon } from "../assets/edit.svg"

import "./productCard.css";
import { AppStateCtx } from "../App.tsx";
import { formatPrice } from "../utility/generic.ts";
import CollapseElement from "./CollapseElement.tsx";

interface PropType{
    product:{
        Name: string;
        Price: number;
        documentId:string
    };
    editable?:boolean;
    imgUrl?:string,
    ingredients?:{ documentId:string, Type:string, Name:string }[];
    allergens?:{ documentId:string, Name:string }[];
    setErr?:Function;
}

function ProductCard({product,ingredients,allergens,editable, imgUrl = placeholder, setErr}:PropType){

    const [showAllergen,setShowAllergen] = useState(false);
    const [appState,_] = useContext(AppStateCtx);

    let description = "";
    if(ingredients){
        description = ingredients.sort((a,b) => -a.Type.localeCompare(b.Type))
            .reduce((desc,ig) => desc + ig.Name + ", ","")
    }

    function toggleAllergen(){
        setShowAllergen(s => !s)
    }

    function buyItem(){
        console.log(product)
        axios.post(`${backendUrl}/api/partial-orders`,{ data: {
            productID: product.documentId,
            accessCode: appState.table.accessCode,
            sessionCode: appState.table.sessionCode
        }}).then((res) => {
            console.log(product.Name, "Acquistata");
        }).catch((err) => {
            if(setErr)
                setErr(true);
            console.log("Error:\n",err)
        })
    }

    return(
        <div className="my-card">
            <div className="product-header">
                <img src={imgUrl} alt="Foto del prodotto"/>
                <h3 className="product-name">{product.Name}</h3>
                <h3 className="product-price">{formatPrice(product.Price)} €</h3>
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
                            <li key={a.documentId}>{a.Name}</li>
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