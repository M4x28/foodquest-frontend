import React, { useState } from 'react';
import { order, product } from '../server/server.ts';

import { ReactComponent as ConfirmIcon} from "../assets/confirm.svg"
import { ReactComponent as ClockIcon} from "../assets/clock.svg"
import { ReactComponent as DownIcon} from "../assets/down.svg";
import { ReactComponent as UpIcon} from "../assets/up.svg";

import "./orderCard.css"
import { formatPrice } from '../utility/generic.ts';
import CollapseElement from './CollapseElement.tsx';

interface OrderCardProps {
    order:order,
    index:number
}

interface prodWithQuantity extends product{
    quantity:number
}

function OrderCard({ order,index }: OrderCardProps) {
    
    const [showItem,setShowItem] = useState(false);

    const productMap: { [key: string]: prodWithQuantity } = {};

    order.products.forEach((p) => {
        if (productMap[p.documentId]) {
            productMap[p.documentId].quantity += 1;
        } else {
            productMap[p.documentId] = { ...p, quantity: 1 };
        }
    });

    const products = Object.values(productMap);

    function toggleItem(){
        setShowItem((s) => !s);
    }

    return (
        <div className="my-card">
            <div className='order-header'>
                <h2 className='order-name'>Ordine #{index}</h2>
                {order.status === "Done" ? 
                    <ConfirmIcon className="done-icon"/> : 
                    <ClockIcon className="wip-icon"/>
                }
                <p className='time'>{order.status === "Done" ? "Completato" : order.time + "m"}</p>
            </div>
            <CollapseElement open={showItem}>
                <dl className='item-list'>
                {
                    products.map(p => <Item key={p.documentId} name={p.name} quantity={p.quantity} price={p.price}/>)
                }
                </dl>
            </CollapseElement>
            <button className="item-toggle" onClick={toggleItem}>
                {showItem ? <DownIcon /> : <UpIcon />}
            </button>
        </div>
    );
}

export default OrderCard;

function Item({name,quantity,price}:{name:string,quantity:number,price:number}){

    return(
        <>
            <dt>{name} x {quantity}</dt>
            <dd>{formatPrice(price * quantity)} €</dd>
        </>
    )

}