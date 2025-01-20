import React, { useContext, useEffect, useMemo, useState } from "react";
import Header, { Pages } from "../components/utility/Header.tsx";
import "../bootstrap.css";
import ImageStack from "../components/PizzaBuilder/ImageStack.tsx";
import BaseDropdown from "../components/PizzaBuilder/BaseDropdown.tsx";
import ExtraIngredientsList from "../components/PizzaBuilder/ExtraIngredientsList.tsx";
import { Button } from "../components/input/Button.tsx";
import Popup from "../components/popup/Popup.tsx";
import IngredientSearchList from "../components/PizzaBuilder/IngredientSearchList.tsx";
import { AppStateCtx, backendServer } from "../App.tsx";
import { toErrorPage } from "../utility/generic.ts";
import { useNavigate, useParams } from "react-router-dom";
import { DetailIngredient, Table } from "../server/server.ts";

const PizzaBuilder: React.FC = () => {
    const [appState, _] = useContext(AppStateCtx);
    const navigate = useNavigate();

    const { productID } = useParams();

    const [allIngredients, setAllIngredients] = useState<DetailIngredient[]>([]);
    const [popupState, setPopupState] = useState<boolean>(false);
    const [recommendedIngredients, setRecommendedIngredients] = useState<DetailIngredient[] | undefined>(undefined);
    const [ingredientWithRecommendation, setIngredientWithRecommendation] = useState<DetailIngredient | null>(null);

    useEffect(() => {
        const fetchInitialIngredients = async () => {
            try {
                const initialBaseIngredient = await backendServer.ingredient.getDefaultBaseIngredient();
                const defaultIngredients = await backendServer.ingredient.getDefaultExtraIngredient();
                setAllIngredients([...initialBaseIngredient, ...defaultIngredients]);
            } catch (error) {
                console.error("Errore nel caricamento degli ingredienti iniziali:", error);
            }
        };

        fetchInitialIngredients();
    }, []);  // Eseguito solo una volta al montaggio del componente

    useEffect(() => {
        const fetchIngredientsIfNeeded = async () => {
            if (productID) {
                try {
                    const ingredients = await backendServer.products.getProductIngredients(productID);
                    if (ingredients && Array.isArray(ingredients)) {
                        setAllIngredients(ingredients);
                    } else {
                        console.warn("La risposta del backend non contiene un array di ingredienti valido.");
                    }
                } catch (error) {
                    console.error("Impossibile caricare gli ingredienti per il prodotto con ID:", productID, error);
                }
            }
        };

        fetchIngredientsIfNeeded();
    }, [productID]);  // Eseguito ogni volta che productID cambia

    const handleAddIngredients = (newIngredients: DetailIngredient[]) => {
        const uniqueIngredients = newIngredients.filter(
            (newIng) => !allIngredients.some((ing) => ing.documentId === newIng.documentId)
        );
        setAllIngredients((prev) => [...prev, ...uniqueIngredients]);

        // Controlla se gli ingredienti hanno raccomandazioni
        const recommendations = [
            ...(recommendedIngredients || []), // Mantieni gli ingredienti raccomandati già esistenti
            ...newIngredients.flatMap((newIng) => newIng.recommended_ingredient || []),
        ];

        // Filtra le raccomandazioni già presenti in allIngredients
        const filteredRecommendations = recommendations.filter(
            (rec) => !allIngredients.some((ing) => ing.documentId === rec.documentId)
        );

        // Rimuovi duplicati dalle raccomandazioni
        const uniqueRecommendations = filteredRecommendations.filter(
            (rec, index, self) =>
                self.findIndex((r) => r.documentId === rec.documentId) === index
        );

        if (uniqueRecommendations.length > 0) {
            setRecommendedIngredients(uniqueRecommendations);
            setIngredientWithRecommendation(newIngredients[0]);
        } else {
            setRecommendedIngredients(undefined);
            setIngredientWithRecommendation(null);
        }
    };

    const handleAddRecommendedIngredients = () => {
        if (recommendedIngredients && recommendedIngredients.length > 0) {
            handleAddIngredients(recommendedIngredients);
            setRecommendedIngredients(undefined);
            setIngredientWithRecommendation(null);
        }
    };

    const handleRemoveIngredients = (ingredientIds: string[]) => {
        setAllIngredients((prev) =>
            prev.filter((item) => !ingredientIds.includes(item.documentId))
        );
    };

    const handleReplaceBaseIngredient = (newBaseIngredient: DetailIngredient) => {
        setAllIngredients((prev) => [
            newBaseIngredient,
            ...prev.filter((ing) => ing.type !== "pizza-base"),
        ]);
    };

    // Calcola il totale utilizzando useMemo per ottimizzare le performance
    const totalPrice = useMemo(() => {
        return allIngredients.reduce((total, ingredient) => total + ingredient.price, 0).toFixed(2);
    }, [allIngredients]);

    function addProductToCart(table: Table, productId: string): void {
        backendServer.products.addProductToCart(table, productId, appState.user ? appState.user.user.documentId : undefined)
            .then(() => {
                console.log(productId, "Acquistata");
                navigate("/order"); // Reindirizza a /order in caso di successo
            }).catch((err) => {
                toErrorPage(navigate);
                console.log("Error:\n", err)
            })
    }

    async function createNewProductHandler(): Promise<string> {
        try {
            // Ottieni l'ID della categoria 'pizza'
            const pizzaCategoryId = await backendServer.categories.getPizzaCategoryId();
            if (!pizzaCategoryId) {
                throw new Error("Categoria 'pizza' non trovata.");
            }

            // Trova l'ingrediente base
            const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");
            if (!baseIngredient) {
                throw new Error("Nessun ingrediente di tipo 'pizza-base' trovato.");
            }
            const baseId = baseIngredient.documentId;

            // Filtra e mappa gli ID degli ingredienti extra
            const ingredientsId = allIngredients
                .filter((ing) => ing.type !== "pizza-base")
                .map((ing) => ing.documentId);

            // Crea un prodotto personalizzato con gli ingredienti
            const newProductId = backendServer.products.createCustomProductFromIngredients(appState.table, pizzaCategoryId, baseId, ingredientsId);
            if (!newProductId) {
                throw new Error("Errore durante la creazione del prodotto personalizzato.");
            }

            return newProductId;
        } catch (error) {
            console.error("Errore nella creazione del prodotto:", error);
            throw error; // Propaga l'errore per una gestione ulteriore
        }
    }

    return (
        <>
            <Header pageName="Crea Pizza" current={Pages.Home} />

            <ImageStack allIngredients={allIngredients} height={"400px"} />

            <BaseDropdown handleReplaceBaseIngredient={handleReplaceBaseIngredient} />

            <div className="bg-white pb-1 rounded-4 mx-3 border border-4 border-info shadow-lg">
                <ExtraIngredientsList
                    extraIngredients={allIngredients.filter((ing) => ing.type !== "pizza-base")}
                    handleRemoveIngredient={(ingredientId) => handleRemoveIngredients([ingredientId])}
                ></ExtraIngredientsList>

                <div className="text-center mt-2">
                    <h3><b>Totale: {totalPrice}€</b></h3>
                </div>

                {recommendedIngredients && ingredientWithRecommendation && !allIngredients.some((ing) => ing.documentId === recommendedIngredients.slice(-1)[0]?.documentId) && (
                    <div className="px-3 py-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5>
                                Abbina {ingredientWithRecommendation.name} con un tocco speciale di
                                {recommendedIngredients.slice(-1).map((recIng) => (
                                    <span
                                        key={recIng.documentId}
                                        className="text-LG text-info mx-1"
                                        onClick={() => handleAddIngredients([recIng])}
                                    >
                                        {recIng.name}
                                    </span>
                                ))}
                                <Button
                                    variant="info"
                                    className="rounded-3"
                                    size="sm"
                                    onClick={handleAddRecommendedIngredients}
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
                <div className="col-6">
                    <Button className="border border-3 border-white" variant="info" onClick={() => setPopupState(!popupState)}>
                        <h5 className="text-LG">Aggiungi Ingrediente</h5>
                    </Button>
                </div>
                <div className="col-6">
                    <Button
                        className="border border-3 border-white"
                        variant="success"
                        size="xl"
                        onClick={async () => {
                            try {
                                addProductToCart(appState.table, await createNewProductHandler()); // Passa l'ID del prodotto a addProductToCart
                            } catch (error) {
                                console.error("Errore durante l'aggiunta del prodotto al carrello:", error);
                                alert("Errore durante l'aggiunta del prodotto al carrello");
                            }
                        }}
                    >
                        <h5 className="text-LG">Aggiungi al Carrello</h5>
                    </Button>
                </div>
            </div>

            <Popup isOpen={popupState} close={() => setPopupState(!popupState)}>
                <IngredientSearchList handleAddIngredients={handleAddIngredients} setPopupState={setPopupState} popupState={popupState} recommendedIngredients={recommendedIngredients} allIngredients={allIngredients} />
            </Popup>
        </>
    );
};

export default PizzaBuilder;