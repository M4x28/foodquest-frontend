// React e backendConnector
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppStateCtx, backendServer } from "../App.tsx";
// Style
import "../bootstrap.css";
// Components
import { Button } from "../components/input/Button.tsx";
import BaseDropdown from "../components/PizzaBuilder/BaseDropdown.tsx";
import ExtraIngredientsList from "../components/PizzaBuilder/ExtraIngredientsList.tsx";
import ImageStack from "../components/PizzaBuilder/ImageStack.tsx";
import IngredientSearchList from "../components/PizzaBuilder/IngredientSearchList.tsx";
import RecommendedIngredient from "../components/PizzaBuilder/RaccomandedIngredient.tsx";
import Popup from "../components/popup/Popup.tsx";
import Header, { Pages } from "../components/utility/Header.tsx";
import { DetailIngredient, Table } from "../server/server.ts";
// Utility
import { toErrorPage } from "../utility/generic.ts";

const PizzaBuilder: React.FC = () => {
    // Ottieni lo stato dell'applicazione dal contesto
    const [appState, _] = useContext(AppStateCtx);
    // Hook per la navigazione
    const navigate = useNavigate();

    // Ottieni l'ID del prodotto dai parametri dell'URL
    const { productID } = useParams();

    // Stato per tutti gli ingredienti
    const [allIngredients, setAllIngredients] = useState<DetailIngredient[]>([]);
    // Stato per la visibilità del popup
    const [popupState, setPopupState] = useState<boolean>(false);
    // Stato per gli ingredienti raccomandati
    const [recommendedIngredients, setRecommendedIngredients] = useState<DetailIngredient[] | undefined>(undefined);
    // Stato per l'ingrediente con raccomandazione
    const [ingredientWithRecommendation, setIngredientWithRecommendation] = useState<DetailIngredient | null>(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                if (productID) {
                    // Carica gli ingredienti specifici del prodotto se presente
                    const ingredients = await backendServer.products.getProductIngredients(productID);
                    if (ingredients && Array.isArray(ingredients)) {
                        setAllIngredients(ingredients);
                    } else {
                        // Avviso warning in console se la risposta non contiene un array di ingredienti valido
                        console.warn("La risposta del backend non contiene un array di ingredienti valido.");
                    }
                } else {
                    // Carica gli ingredienti predefiniti
                    const initialBaseIngredient = await backendServer.ingredient.getDefaultBaseIngredient();
                    const defaultIngredients = await backendServer.ingredient.getDefaultExtraIngredient();
                    setAllIngredients([...initialBaseIngredient, ...defaultIngredients]);
                }
            } catch (error) {
                console.error("Errore nel caricamento degli ingredienti:", error);
            }
        };

        fetchIngredients();
    }, [productID]); // Eseguito ogni volta che productID cambia

    // Funzione per aggiungere nuovi ingredienti
    const handleAddIngredients = (newIngredients: DetailIngredient[]) => {
        // Filtra gli ingredienti unici
        const uniqueIngredients = newIngredients.filter(
            // some() restituisce true se almeno un elemento soddisfa la condizione
            (newIng) => !allIngredients.some((ing) => ing.documentId === newIng.documentId)
        );
        setAllIngredients((prev) => [...prev, ...uniqueIngredients]);

        // Controlla se gli ingredienti hanno raccomandazioni
        // flatMap
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

    // Funzione per aggiungere ingredienti raccomandati
    const handleAddRecommendedIngredients = () => {
        if (recommendedIngredients && recommendedIngredients.length > 0) {
            handleAddIngredients(recommendedIngredients);
            setRecommendedIngredients(undefined);
            setIngredientWithRecommendation(null);
        }
    };

    // Funzione per rimuovere ingredienti
    const handleRemoveIngredients = (ingredientIds: string[]) => {
        // Filtra gli ingredienti attuali rimuovendo quelli specificati, capace di rimuovere più ingredienti contemporaneamente
        setAllIngredients((prev) =>
            prev.filter((item) => !ingredientIds.includes(item.documentId))
        );

        // Aggiorna gli ingredienti consigliati rimuovendo quelli collegati agli ingredienti rimossi
        setRecommendedIngredients((prev) =>
            prev?.filter((rec) => !ingredientIds.includes(rec.documentId))
        );

        // Se l'ingrediente con raccomandazione è stato rimosso, rimuovi anche la raccomandazione
        if (ingredientWithRecommendation && ingredientIds.includes(ingredientWithRecommendation.documentId)) {
            setRecommendedIngredients(undefined);
            setIngredientWithRecommendation(null);
        }
    };

    // Sostituisci l'ingrediente base con quello nuovo
    const handleReplaceBaseIngredient = (newBaseIngredient: DetailIngredient) => {
        setAllIngredients((prev) => [
            newBaseIngredient,
            ...prev.filter((ing) => ing.type !== "pizza-base"),
        ]);
    };

    // Calcola il totale utilizzando useMemo per ottimizzare le performance
    // useMemo un hook di React utilizzato per memorizzare un valore calcolato, evitando di ricalcolarlo inutilmente ad ogni render, a meno che una delle dipendenze specificate cambi.
    const totalPrice = useMemo(() => {
        return allIngredients.reduce((total, ingredient) => total + ingredient.price, 0).toFixed(2);
    }, [allIngredients]);

    // Funzione per aggiungere un prodotto al carrello
    const addProductToCart = (table: Table, productId: string): void => {
        backendServer.products.addProductToCart(table, productId, appState.user ? appState.user.user.documentId : undefined)
            .then(() => {
                console.log(productId, "Acquistata");
                navigate("/order"); // Reindirizza a /order in caso di successo
            }).catch((err) => {
                toErrorPage(navigate);
                console.log("Error:\n", err)
            })
    }

    // Funzione per creare un nuovo prodotto personalizzato
    async function createNewProductHandler(): Promise<string> {
        try {
            // Ottieni l'ID della categoria 'pizza'
            const pizzaCategoryId = await backendServer.categories.getPizzaCategoryId();
            if (!pizzaCategoryId) {
                console.error("Categoria 'pizza' non trovata.");
            }

            // Trova l'ingrediente base
            const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");
            if (!baseIngredient) {
                console.error("Nessun ingrediente di tipo 'pizza-base' trovato.");
            }
            const baseId = baseIngredient ? baseIngredient.documentId : undefined;

            // Filtra e mappa gli ID degli ingredienti extra
            const ingredientsId = allIngredients
                .filter((ing) => ing.type !== "pizza-base")
                .map((ing) => ing.documentId);

            // Crea un prodotto personalizzato con gli ingredienti
            const newProductId = await backendServer.products.createCustomProductFromIngredients(appState.table, pizzaCategoryId, baseId, ingredientsId);
            if (!newProductId) {
                console.error("Errore durante la creazione del prodotto personalizzato.");
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

            <BaseDropdown initialSelectedBase={allIngredients.find((ing) => ing.type == "pizza-base")} handleReplaceBaseIngredient={handleReplaceBaseIngredient} />

            <div className="bg-white pb-1 rounded-4 mx-3 border border-4 border-info shadow-lg">
                <ExtraIngredientsList
                    extraIngredients={allIngredients.filter((ing) => ing.type !== "pizza-base")}
                    handleRemoveIngredient={(ingredientId) => handleRemoveIngredients([ingredientId])}
                ></ExtraIngredientsList>

                <div className="text-center mt-2">
                    <h3><b>Totale: {totalPrice}€</b></h3>
                </div>

                <RecommendedIngredient
                    ingredientWithRecommendation={ingredientWithRecommendation}
                    recommendedIngredients={recommendedIngredients}
                    handleAddIngredients={handleAddIngredients}
                    handleAddRecommendedIngredients={handleAddRecommendedIngredients}
                ></RecommendedIngredient>
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