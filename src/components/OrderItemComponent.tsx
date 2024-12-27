import React from "react"
import { Button } from "./Button.tsx";

// OrderItemComponent
interface OrderItemProps {
    name: string;
    quantity: number;
    price: number;
    ingredients?: string[];
}

export const OrderItemComponent: React.FC<OrderItemProps> = ({ name, quantity, price, ingredients }) => {
    return (
        <div className="row py-2 align-items-center">
            <div className="col-2 text-center">
                <Button type="submit" variant="outline-danger" style={{ border: '2px solid red', borderRadius: '50px', width: '40px', height: '40px' }} size="sm" onClick={undefined}><b>-</b></Button>
            </div>
            <div className="col-8 text-start">
                <span>{`${name} x ${quantity}`}</span>
                {ingredients && ingredients.length > 0 && (
                    <ul className="mt-1" style={{ fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                        {ingredients.map((ingredient) => (
                            <li key={ingredient.id}>{`${ingredient.name} (${ingredient.price}€)`}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="col-2">
                <span>{`${price}€`}</span>
            </div>
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