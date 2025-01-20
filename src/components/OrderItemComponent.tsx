import React from "react"; // Importa la libreria React per creare componenti.
import './OrderItemComponent.css'; // Importa il file CSS per gli stili specifici del componente.
import { Ingredient } from "../server/server"; // Importa il tipo Ingredient dal modulo server.

// Interfaccia per gli elementi dell'ordine
interface OrderItemProps { // Definisce la struttura delle proprietà che il componente accetta.
    name: string; // Nome dell'elemento.
    quantity: number; // Quantità dell'elemento.
    price: number; // Prezzo per unità dell'elemento.
    ingredients?: Ingredient[]; // Opzionale: lista di ingredienti con prezzi aggiuntivi.
}

// Componente per un singolo elemento dell'ordine
export const OrderItemComponent: React.FC<OrderItemProps> = ({ name, quantity, price, ingredients }) => {
    return (
        <div className="row py-2 align-items-center"> {/* Contenitore flessibile allineato verticalmente con padding */}
            {/* Bottone e nome pizza */}
            <div
                className="col-8 text-start alimbox"> {/* orderItemComponent.css(alimbox) */}
                {/* Colonna per il bottone e il nome della pizza, allineati a sinistra */}
                <button
                    className="custom-button" // orderItemComponent.css(custom-button)
                    type="submit" // Specifica che il bottone invia un modulo.
                    onClick={(e) => { // Funzione click per aggiungere e rimuovere una classe animata.
                        const button = e.currentTarget; // Ottiene l'elemento del bottone cliccato.
                        button.classList.add('button-animate'); // Aggiunge una classe per l'animazione.
                        setTimeout(() => button.classList.remove('button-animate'), 300); // Rimuove la classe dopo l'animazione.
                    }}
                >
                    <b className="text-danger">-</b> {/* bootstrap.css(col-12,text-start) */}
                    {/* Bottone con testo rosso per ridurre la quantità */}
                </button>
                <span>{`${name} x ${quantity}`}</span> {/* Mostra il nome e la quantità dell'elemento */}
            </div>
            {/* Prezzo */}
            <div className="col-4 text-end price-style"> {/* orderItemComponent.css(price-style) */}
                <span>{`${price * quantity}€`}</span> {/* Calcola e mostra il prezzo totale */}
            </div>
            {/* Lista ingredienti */}
            {ingredients && ingredients.length > 0 && ( // Mostra gli ingredienti se sono definiti e non vuoti.
                <div className="col-12 text-start"> {/* bootstrap.css(col-12,text-start) */}
                    <ul style={{ fontSize: '0.9rem' }}> {/* Lista non ordinata con font ridotto */}
                        {ingredients.map((ingredient) => ( // Cicla attraverso la lista degli ingredienti.
                            <li
                                className="ingrendient-list"
                                key={ingredient.documentId} // Chiave unica per ogni elemento della lista.
                            >{`${ingredient.name} (+${ingredient.price}€)`}</li> // Mostra il nome e il prezzo aggiuntivo dell'ingrediente.
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// OrderCategoryComponent
interface OrderCategoryProps { // Definisce la struttura delle proprietà per la categoria degli ordini.
    title: string; // Titolo della categoria.
    items: OrderItemProps[]; // Lista degli elementi della categoria.
}

export const OrderCategoryComponent: React.FC<OrderCategoryProps> = ({ title, items }) => {
    return (
        <div className="mb-3 rounded cat-box" >  {/* orderItemComponent.css(cat-box), bootstrap.css(mb-3,rounded) */}
            {/* Contenitore con margine e bordi arrotondati */}
            <h5 className="bg-success text-white p-2 m-0 item-style" >{title}</h5> {/* orderItemComponent.css(item-style), bootstrap.css(bg-success,text-white,p-2,m-0) */}
            {/* Titolo della categoria con sfondo verde, testo bianco e padding */}
            <div className="bg-light p-2"> {/* Contenitore interno con sfondo chiaro e padding */}
                {items.map((item, index) => ( // Cicla attraverso la lista degli elementi della categoria.
                    <OrderItemComponent key={index} {...item} /> // Usa il componente OrderItemComponent per ogni elemento.
                ))}
            </div>
        </div>
    );
};
