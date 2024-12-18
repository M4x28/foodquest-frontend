import React,{useState} from "react"
import { Link } from "react-router-dom";
import { stopPropagation } from "../utility/generic.ts";

import { ReactComponent as HomeIcon } from "../assets/home.svg"
import { ReactComponent as MenuIcon } from "../assets/menu.svg"
import { ReactComponent as CloseIcon } from "../assets/close.svg"

import { ReactComponent as PizzaIcon } from "../assets/pizza.svg"
import { ReactComponent as CartIcon } from "../assets/shoppingCart.svg"
import { ReactComponent as OrderIcon } from "../assets/order.svg"
import { ReactComponent as AccountIcon } from "../assets/account.svg"

import "../App.css"
import "./Header.css"

export enum Pages{
    Home,
    Order,
    Check,
    FC
}

interface PropType{
    pageName:string
    current:Pages
}

function Header({pageName, current}:PropType){

    const [displayDropdown,setDisplayDropdown] = useState<boolean>(false);

    function toggleDropdown( event ){
        setDisplayDropdown( d => !d );
    }

    return(
        <div className="header-container" >
            <header>
                <Link className="home-btn">   
                    <HomeIcon/>
                </Link>
                <h1>
                    {pageName}
                </h1>
                <button className="menu-btn" onClick={toggleDropdown} title="menu">
                    { !displayDropdown ? <MenuIcon/> : <CloseIcon/>}
                </button>
            </header>
            <div className={"dropdown-overlay glass" + (displayDropdown ? "" : " solid-snake")} onClick={toggleDropdown}>
            <nav className={"dropdown" + (displayDropdown ? "" : " solid-snake")} onClick={stopPropagation}>
                <Link className={"dropdown-voice" + (current === Pages.Home ? " current" : "")}> 
                    <PizzaIcon/> Ordina 
                </Link>
                <Link className={"dropdown-voice" + (current === Pages.Order ? " current" : "")}> 
                    <CartIcon/> Visualizza il tuo ordine 
                </Link>
                <Link className={"dropdown-voice" + (current === Pages.Check ? " current" : "")}> 
                    <OrderIcon/> Resoconto ordini 
                </Link>
                <Link className={"dropdown-voice" + (current === Pages.FC ? " current" : "")}>
                    <AccountIcon/> Fidelity Card 
                </Link>
            </nav>
            </div>
        </div>
    )
}

export default Header;