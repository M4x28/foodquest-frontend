import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header, { Pages } from "../components/Header.tsx";
import "../bootstrap.css";
import ImageStack from "../components/PizzaBuilder/ImageStack.tsx";
import BaseDropdown from "../components/PizzaBuilder/BaseDropdown.tsx";
import { Ingredient, initialBaseIngredient, defaultIngredients } from "../components/PizzaBuilder/IngredientComponent.tsx";
import ExtraIngredientsList from "../components/PizzaBuilder/ExtraIngredientsList.tsx";
import { Button } from "../components/Button.tsx";
import Popup from "../components/Popup.tsx";
import IngredientSearchList from "../components/PizzaBuilder/IngredientSearchList.tsx";

const PizzaBuilder: React.FC = () => {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([
        ...initialBaseIngredient,
        ...defaultIngredients,
    ]);

    const [popupState, setPopupState] = useState<boolean>(false);

    const handleAddIngredients = (newIngredients: Ingredient[]) => {
        const uniqueIngredients = newIngredients.filter(
            (newIng) => !allIngredients.some((ing) => ing.documentId === newIng.documentId)
        );
        setAllIngredients((prev) => [...prev, ...uniqueIngredients]);
    };

    const handleRemoveIngredients = (ingredientIds: string[]) => {
        setAllIngredients((prev) =>
            prev.filter((item) => !ingredientIds.includes(item.documentId))
        );
    };

    const handleReplaceBaseIngredient = (newBaseIngredient: Ingredient) => {
        setAllIngredients((prev) => [
            newBaseIngredient,
            ...prev.filter((ing) => ing.type !== "pizza-base"),
        ]);
    };

    // Calcola il totale utilizzando useMemo per ottimizzare le performance
    const totalPrice = useMemo(() => {
        return allIngredients.reduce((total, ingredient) => total + ingredient.price, 0).toFixed(2);
    }, [allIngredients]);

    return (
        <>
            <Header pageName="Crea Pizza" current={Pages.Home} />

            <ImageStack allIngredients={allIngredients} />

            <BaseDropdown handleReplaceBaseIngredient={handleReplaceBaseIngredient} />

            <ExtraIngredientsList
                extraIngredients={allIngredients.filter((ing) => ing.type !== "pizza-base")}
                handleRemoveIngredient={(ingredientId) => handleRemoveIngredients([ingredientId])}
            ></ExtraIngredientsList>

            <div className="text-center bg-white">
                <h3 className="text-LG">Totale: {totalPrice}</h3>
            </div>

            <div className="mx-4 my-4 p-2 bg-white rounded-3 border border-3 border-info shadow-lg">
                <h5 className="text-LG">Consiglio</h5>
            </div>

            <div
                className="row d-flex align-items-center justify-content-center text-center py-2 px-3"
                style={{
                    position: "fixed",
                    bottom: 10,
                }}
            >
                <div className="col-7">
                    <Button className="border border-3 border-white" variant="info" onClick={() => setPopupState(!popupState)}>
                        <h5 className="text-LG">Aggiungi Ingrediente</h5>
                    </Button>
                </div>
                <div className="col-5">
                    <Button className="border border-3 border-white py-3" variant="success" size="xl">
                        <h5 className="text-LG">Conferma</h5>
                    </Button>
                </div>
            </div>

            <Popup isOpen={popupState} close={() => setPopupState(!popupState)}>
                <IngredientSearchList handleAddIngredients={handleAddIngredients} setPopupState={setPopupState} popupState={popupState} />
            </Popup>
        </>
    );
};

export default PizzaBuilder;