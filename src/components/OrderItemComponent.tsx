import React from "react";
import './OrderItemComponent.css';

// Interfaccia per gli elementi dell'ordine
interface OrderItemProps {
    Name: string;
    quantity: number;
    Price: number;
    ingredients?: { id: number; name: string; price: number }[];
}

// Componente per un singolo elemento dell'ordine
export const OrderItemComponent: React.FC<OrderItemProps> = ({ Name, quantity, Price, ingredients }) => {
    return (
        <div className="row py-2 align-items-center">
            {/* Bottone e nome pizza */}
            <div
                className="col-8 text-start"
                style={{
                    fontFamily: "sans-serif",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    letterSpacing: "0.1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // Allineamento a sinistra
                    gap: "10px", // Spazio tra bottone e nome
                }}
            >
                <button
                    type="submit"
                    style={{
                        display: "flex", // Usa flexbox per centrare il contenuto
                        alignItems: "center", // Allinea verticalmente
                        justifyContent: "center", // Allinea orizzontalmente
                        border: '2px solid red',
                        borderRadius: '50px',
                        width: '30px',
                        height: '30px',
                    }}
                    onClick={(e) => {
                        const button = e.currentTarget;
                        button.classList.add('button-animate');
                        setTimeout(() => button.classList.remove('button-animate'), 300); // Rimuove la classe dopo l'animazione
                    }}
                >
                    <b style={{ color: 'red' }}>-</b>
                </button>
                <span>{`${Name} x ${quantity}`}</span>
            </div>
            {/* Prezzo */}
            <div
                className="col-4 text-end"
                style={{
                    fontSize: "1.2rem",
                    letterSpacing: "0.1rem",
                    fontWeight: "bold",
                }}
            >
                <span>{`${Price * quantity}€`}</span>
            </div>
            {/* Lista ingredienti */}
            {ingredients && ingredients.length > 0 && (
                <div className="col-12 text-start" style={{ paddingLeft: "1.2rem", marginTop: "5px" }}>
                    <ul style={{ fontSize: '0.9rem' }}>
                        {ingredients.map((ingredient) => (
                            <li
                                key={ingredient.id}
                                style={{
                                    fontFamily: "sans-serif",
                                    letterSpacing: "0.1rem",
                                    fontWeight: "bold",
                                }}
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
}

export const OrderCategoryComponent: React.FC<OrderCategoryProps> = ({ title, items }) => {
    return (
        <div className="mb-3 rounded" style={{ border: '3px solid green', overflow: 'hidden' }}>
            <h5 className="bg-success text-white p-2 m-0" style={{ borderBottom: '3px solid #198754', fontFamily: 'Luckiest Guy, Coursive', letterSpacing: '0.1rem' }}>{title}</h5>
            <div className="bg-light p-2">
                {items.map((item, index) => (
                    <OrderItemComponent key={index} {...item} />
                ))}
            </div>
        </div>
    );
};