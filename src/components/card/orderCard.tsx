import React, { useState } from 'react';
import { Order, Product } from '../../server/server.ts';

import { ReactComponent as ConfirmIcon} from "../../assets/confirm.svg"
import { ReactComponent as ClockIcon} from "../../assets/clock.svg"
import { ReactComponent as DownIcon} from "../../assets/down.svg";
import { ReactComponent as UpIcon} from "../../assets/up.svg";

import "./orderCard.css"
import { countProduct, formatPrice } from '../../utility/generic.ts';
import CollapseElement from '../utility/CollapseElement.tsx';

interface OrderCardProps {
    order:Order,
    index:number
}

function OrderCard({ order,index }: OrderCardProps) {
    
    const [showItem,setShowItem] = useState(false);

    const products = countProduct(order.products);

    function toggleItem(){
        setShowItem((s) => !s);
    }

    return (
        <div className="my-card">
            <div className='order-header'>
                <h2 className='order-name luckiest-font'>Ordine #{index}</h2>
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