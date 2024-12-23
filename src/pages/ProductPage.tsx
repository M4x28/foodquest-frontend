import React, { useEffect, useState } from "react";
import Page from "./Page.tsx";
import Header, { Pages } from "../components/Header.tsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../utility/constants.ts";
import ProductCard from "../components/ProductCard.tsx";
import { exdendImgUrl } from "../utility/generic.ts";

function ProductPage(){

    const {categoryID} = useParams()
    const [catName,setCatName] = useState("Loading...");
    const [products,setProducts] = useState<any[]>([]);
    const [ingredients,setIngredient] = useState<any[]>([]);
    const [allergens,setAllergens] = useState<any[]>([]);
    const [customizable,setCustomizable] = useState(false)

    const [error,setError] = useState(false);

    //Fetch on page load all category detail
    useEffect(() => {
        //Fetch product
        axios.get(`${backendUrl}/api/categories/${categoryID}`)
            .then((res) => {
                const {Name,products} = res.data.data;
                setCatName(Name);
                setProducts(products);
                return products
            }).then((prod:any[]) => {
                //Load ingredients if needed
                if(prod.filter((p) => p.ingredients !== undefined).length !== 0){
                    axios.get(`${backendUrl}/api/ingredients`).then((res) => {
                        setIngredient(res.data.data);
                        setCustomizable(true);
                    })
                }
            }).catch((err) => {
                console.log(err);
                setError(true)
            });
        
        //Fetch Allergen
        axios.get(`${backendUrl}/api/allergens`)
            .then((res) => {
                setAllergens(res.data.data)
            }).catch((err) => {
                console.log(err);
                setError(true)
            });
        
    },[categoryID]);

    const err={
        error,
        errorTitle:"Connessione al server fallita",
        errorMessage:"Controlla la tua connessione a internet e riprova"
    }

    return(
        <Page error={err}>
            <Header pageName={catName} current={Pages.Home}/>
            {
                products.map(p => <ProductCard 
                    product={p} key={p.documentId}
                    ingredients={p.ingredients ? ingredients.filter(i => p.ingredients.includes(i.documentId)) : undefined }
                    allergens={p.allergens ? allergens.filter(a => p.allergens.includes(a.documentId)) : undefined }
                    imgUrl={p.image ? exdendImgUrl(p.image) : undefined} editable={customizable}/>)
            }
        </Page>
    );

}

export default ProductPage;