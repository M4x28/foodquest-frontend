import React, { useState } from "react";
import AnimatedButton from "./AnimatedButton.tsx";
import { Link } from "react-router-dom";

import placeholder from "../assets/pizzaPlacehoder.webp";
import { ReactComponent as DownIcon} from "../assets/down.svg";
import { ReactComponent as UpIcon} from "../assets/up.svg";
import { ReactComponent as CartIcon } from "../assets/shoppingCart.svg"
import { ReactComponent as TicIcon } from "../assets/tic.svg"
import { ReactComponent as EditIcon } from "../assets/edit.svg"

import "./productCard.css";

interface PropType{
    product:{
        Name: string;
        Price: number;
    },
    editable?:boolean;
    imgUrl?:string,
    ingredients?:{documentID:string,Type:string,Name:string}[];
    allergens?:any[];
}

function ProductCard({product,ingredients,allergens,editable, imgUrl = placeholder}:PropType){

    const [showAllergen,setShowAllergen] = useState(false);

    let description = "";
    if(ingredients){
        description = ingredients.sort((a,b) => -a.Type.localeCompare(b.Type))
            .reduce((desc,ig) => desc + ig.Name + ", ","")
    }

    function formatPrice(price:number):string{
        if(isNaN(price)){
            return "Nan"
        }

        return price.toFixed(2)
    }

    function toggleAllergen(){
        setShowAllergen(s => !s)
    }

    function buyItem(){
        console.log("Placehoder per aver acquistato",product.Name);
    }

    return(
        <div className="product-card">
            <section className="product-header">
                <img src={imgUrl} alt="Foto del prodotto"/>
                <h3 className="product-name">{product.Name}</h3>
                <h3 className="product-price">{formatPrice(product.Price)} €</h3>
            </section>
            { description && <p className="product-description">{description}</p> }
            <section className="product-buttons">
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
            </section>
            {showAllergen &&
                <section className="product-allergen">
                    {allergens && allergens?.length > 0 ?
                        <ul>
                            {allergens.map(a => 
                                <li key={a.documentId}>{a.Name}</li>
                            )}           
                        </ul>
                        :
                        <p>Nessun allergene comune presente</p>
                    }
                </section>
            }
        </div>
    )
}

export default ProductCard;