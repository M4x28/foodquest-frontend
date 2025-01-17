import React, { useMemo, useState } from "react";
import Header, { Pages } from "../components/utility/Header.tsx";
import "../bootstrap.css";
import ImageStack from "../components/PizzaBuilder/ImageStack.tsx";
import BaseDropdown from "../components/PizzaBuilder/BaseDropdown.tsx";
import { Ingredient, initialBaseIngredient, defaultIngredients } from "../components/PizzaBuilder/IngredientComponent.tsx";
import ExtraIngredientsList from "../components/PizzaBuilder/ExtraIngredientsList.tsx";
import { Button } from "../components/input/Button.tsx";
import Popup from "../components/popup/Popup.tsx";
import IngredientSearchList from "../components/PizzaBuilder/IngredientSearchList.tsx";

const PizzaBuilder: React.FC = () => {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([
        ...initialBaseIngredient,
        ...defaultIngredients,
    ]);

    const [popupState, setPopupState] = useState<boolean>(false);
    const [recommendedIngredient, setRecommendedIngredient] = useState<Ingredient | undefined>(undefined);
    const [ingredientWithRecommendation, setIngredientWithRecommendation] = useState<Ingredient | null>(null);

    const handleAddIngredients = (newIngredients: Ingredient[]) => {
        const uniqueIngredients = newIngredients.filter(
            (newIng) => !allIngredients.some((ing) => ing.documentId === newIng.documentId)
        );
        setAllIngredients((prev) => [...prev, ...uniqueIngredients]);

        // Controlla se l'ingrediente ha una raccomandazione
        if (newIngredients[0]?.recommended_ingredient) {
            setRecommendedIngredient(newIngredients[0].recommended_ingredient);
            setIngredientWithRecommendation(newIngredients[0]);
        } else {
            setRecommendedIngredient(undefined);
            setIngredientWithRecommendation(null);
        }
    };

    const handleAddRecommendedIngredient = () => {
        if (recommendedIngredient) {
            handleAddIngredients([recommendedIngredient]);
            setRecommendedIngredient(undefined);
            setIngredientWithRecommendation(null);
        }
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

            <div className="bg-white pb-1 rounded-4 mx-3 border border-4 border-info shadow-lg">
                <ExtraIngredientsList
                    extraIngredients={allIngredients.filter((ing) => ing.type !== "pizza-base")}
                    handleRemoveIngredient={(ingredientId) => handleRemoveIngredients([ingredientId])}
                ></ExtraIngredientsList>

                <div className="text-center mt-2">
                    <h3><b>Totale: {totalPrice}€</b></h3>
                </div>

                {recommendedIngredient && ingredientWithRecommendation && (
                    <div className="px-3 py-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5>
                                Abbina {ingredientWithRecommendation.name} con un tocco speciale di <span className="text-LG text-info" onClick={handleAddRecommendedIngredient}>{recommendedIngredient.name}</span>
                                <Button
                                    variant="info"
                                    className="rounded-3"
                                    size="sm"
                                    onClick={handleAddRecommendedIngredient}
                                    style={{ marginLeft: '10px' }}
                                >
                                    +
                                </Button>
                            </h5>
                        </div>
                    </div>
                )}
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
                <IngredientSearchList handleAddIngredients={handleAddIngredients} setPopupState={setPopupState} popupState={popupState} recommendedIngredient={recommendedIngredient} />
            </Popup>
        </>
    );
};

export default PizzaBuilder;