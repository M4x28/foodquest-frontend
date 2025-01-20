import React, { useState } from 'react'; // Importa React e il hook useState
import { Order, Product } from '../../server/server.ts'; // Importa i tipi Order e Product

// Importa le icone come componenti React
import { ReactComponent as ConfirmIcon } from "../../assets/confirm.svg";
import { ReactComponent as ClockIcon } from "../../assets/clock.svg";
import { ReactComponent as DownIcon } from "../../assets/down.svg";
import { ReactComponent as UpIcon } from "../../assets/up.svg";

import "./orderCard.css"; // Importa i CSS specifici per il componente
import { countProduct, formatPrice } from '../../utility/generic.ts'; // Importa funzioni di utilità
import CollapseElement from '../utility/CollapseElement.tsx'; // Importa il componente CollapseElement

// Definizione delle proprietà per il componente OrderCard
interface OrderCardProps {
    order: Order; // Oggetto ordine
    index: number; // Indice dell'ordine nella lista
}

// Componente principale OrderCard
function OrderCard({ order, index }: OrderCardProps) {
    const [showItem, setShowItem] = useState(false); // Stato per gestire la visibilità dei dettagli dell'ordine

    const products = countProduct(order.products); // Conta i prodotti nell'ordine

    // Funzione per alternare la visibilità dei dettagli dell'ordine
    function toggleItem() {
        setShowItem((s) => !s);
    }

    return (
        <div className="my-card"> {/* Contenitore principale dell'ordine */}
            <div className="order-header">
                {/* Intestazione dell'ordine, orderCard.css(order-header) */}
                <h2 className="order-name luckiest-font">Ordine #{index}</h2>
                {/* Titolo dell'ordine, orderCard.css(order-name), luckiest-font.css(luckiest-font) */}
                {order.status === "Done" ?
                    <ConfirmIcon className="done-icon" /> :
                    <ClockIcon className="wip-icon" />
                    /* Icona in base allo stato dell'ordine, orderCard.css(done-icon, wip-icon) */}
                <p className="time">{order.status === "Done" ? "Completato" : order.time + "m"}</p>
                {/* Mostra lo stato o il tempo rimanente, orderCard.css(time) */}
            </div>
            <CollapseElement open={showItem}>
                {/* Sezione espandibile con i dettagli, CollapseElement gestisce la visibilità */}
                <dl className="item-list">
                    {/* Lista degli articoli, orderCard.css(item-list) */}
                    {products.sort((a, b) =>
                        a.category.documentId.localeCompare(b.category.documentId))
                        .map(p => (
                            <Item
                                key={p.documentId}
                                name={p.name}
                                quantity={p.quantity}
                                price={p.price}
                            />
                        )) /* Ordina e mappa ogni prodotto in un componente Item */}
                </dl>
            </CollapseElement>
            <button className="item-toggle" onClick={toggleItem}>
                {/* Bottone per alternare la visibilità, orderCard.css(item-toggle) */}
                {showItem ? <DownIcon /> : <UpIcon />}
                {/* Mostra un'icona diversa a seconda dello stato, orderCard.css(svg) */}
            </button>
        </div>
    );
}

export default OrderCard; // Esporta il componente OrderCard

// Componente Item per visualizzare un singolo prodotto
function Item({ name, quantity, price }: { name: string; quantity: number; price: number }) {
    return (
        <>
            <dt>{name} x {quantity}</dt>
            {/* Nome e quantità del prodotto, orderCard.css(dt) */}
            <dd>{formatPrice(price * quantity)} €</dd>
            {/* Prezzo totale del prodotto, orderCard.css(dd) */}
        </>
    );
}
