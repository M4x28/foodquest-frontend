import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from '../components/Button.tsx';
import Header, { Pages } from "../components/Header.tsx";
import { OrderCategoryComponent } from '../components/OrderItemComponent.tsx';
import { OrderToggle } from '../components/OrderToggle.tsx';


// Main OrderPage
const OrderPage: React.FC = () => {
    const pizzaItems = [
        { name: 'Margherita', quantity: 2, price: 80 },
        { name: 'Diavola', quantity: 1, price: 7, ingredients: [{ id: 6, name: 'Salsiccia di Norcia', price: 2 }] },
    ];
    const antipastiItems = [
        { name: 'Patatine', quantity: 2, price: 6 },
        { name: 'Polpette', quantity: 2, price: 4 },
    ];
    const bevandeItems = [
        { name: 'Coca-Cola', quantity: 1, price: 6 },
        { name: 'Acqua', quantity: 2, price: 4 },
        { name: 'Pepsi', quantity: 1, price: 4 },
    ];

    return (
        <>
            <Header pageName="Ordine" current={Pages.Order} />
            <div className="p-4" style={{ marginTop: '100px' }}>
                <OrderCategoryComponent title="PIZZE" items={pizzaItems} />
                <OrderCategoryComponent title="ANTIPASTI" items={antipastiItems} />
                <OrderCategoryComponent title="BEVANDE" items={bevandeItems} />
                <OrderToggle />
                <Button type="submit" variant="success w-100" size="lg" onClick={undefined} >Conferma</Button>
            </div>
        </>
    );
};

export default OrderPage;