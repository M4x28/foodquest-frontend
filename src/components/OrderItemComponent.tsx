import React, { useEffect, useState } from "react";
import { backendServer } from "../App.tsx";
import { Ingredient } from "../server/server";
import './OrderItemComponent.css';

// Interfaccia per gli elementi dell'ordine
interface OrderItemProps {
    documentId: string;
    name: string;
    quantity: number;
    price: number;
    ingredients?: Ingredient[];
    orderID: string;
}

// Componente per un singolo elemento dell'ordine
export const OrderItemComponent: React.FC<OrderItemProps> = ({ name, quantity, price, ingredients, orderID, documentId }) => {
    const [loadedIngredients, setLoadedIngredients] = useState<Ingredient[] | undefined>(ingredients); // Stato per gli ingredienti caricati

    // Effetto per caricare gli ingredienti se non sono già presenti
    useEffect(() => {
        if (!ingredients || ingredients.length === 0) {
            backendServer.products.getProductIngredients(documentId)
                .then((fetchedIngredients) => {
                    setLoadedIngredients(fetchedIngredients || []); // Aggiorna lo stato con gli ingredienti caricati
                })
                .catch((err) => {
                    console.error("Errore nel caricamento degli ingredienti:", err);
                });
        }
    }, [ingredients, documentId]);

    return (
        <div className="row py-2 align-items-center">
            {/* Bottone e nome pizza */}
            <div className="col-8 text-start alimbox">
                <button
                    className="custom-button"
                    type="submit"
                    onClick={(e) => {
                        const button = e.currentTarget;
                        button.classList.add('button-animate'); // Aggiunge l'animazione
                        setTimeout(() => button.classList.remove('button-animate'), 300); // Rimuove l'animazione
                        backendServer.orders.removeProductFromOrder(orderID, documentId) // Rimuove il prodotto dal backend
                            .then(() => {
                                window.location.reload();
                            })
                            .catch((err) => {
                                console.error("Errore nella rimozione del prodotto:", err);
                            });
                    }}
                >
                    <b className="text-danger">-</b>
                </button>
                <span>{`${name} x ${quantity}`}</span> {/* Mostra il nome e la quantità dell'elemento */}
            </div>
            {/* Prezzo */}
            <div className="col-4 text-end price-style">
                <span>{`${price * quantity}€`}</span>
            </div>
            {/* Lista ingredienti */}
            {name === "Custom" && loadedIngredients && loadedIngredients.length > 0 && (
                <div className="col-12 text-start">
                    <ul style={{ fontSize: '0.9rem' }}>
                        {loadedIngredients.map((ingredient) => (
                            <li
                                className="ingrendient-list" // Aggiunta classe per gli stili
                                key={ingredient.documentId}
                            >{`${ingredient.name} (+${ingredient.price}€)`}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// OrderCategoryComponent
interface OrderCategoryProps {
    title: string;
    items: OrderItemProps[];
    orderID: string;
}

export const OrderCategoryComponent: React.FC<OrderCategoryProps> = ({ title, items, orderID }) => {
    return (
        <div className="mb-3 rounded cat-box">
            {/* Titolo della categoria */}
            <h5 className="text-white p-2 m-0 item-style" style={{ backgroundColor: 'var(--very-dark-col)' }}>{title}</h5>
            {/* Contenitore per gli elementi */}

            <div className="bg-light p-2">
                {items.map((item, index) => (
                    <OrderItemComponent
                        key={index}
                        orderID={orderID}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
};
