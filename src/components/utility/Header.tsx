import React, { useState } from "react";
import { Link } from "react-router-dom";
import { stopPropagation } from "../../utility/generic.ts";

import { ReactComponent as AccountIcon } from "../../assets/account.svg";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as OrderIcon } from "../../assets/order.svg";
import { ReactComponent as PizzaIcon } from "../../assets/pizza.svg";
import { ReactComponent as CartIcon } from "../../assets/shoppingCart.svg";

import "../../App.css";
import "./Header.css";

export enum Pages {
    Home,   // Pagina Home
    Order,  // Pagina Ordini
    Check,  // Pagina Resoconto Ordini
    FC      // Pagina Fidelity Card
}

interface PropType {
    pageName: string;  // Current page name (Title of the header)
    current: Pages;    // Current page type for dropdown menù
}

/**
 * Componente Header.
 * Rappresenta l'intestazione con un menu a tendina per la navigazione.
 */
function Header({ pageName, current }: PropType) {

    const [displayDropdown, setDisplayDropdown] = useState<boolean>(false);

    //Toggle dropdown menù open or closed
    function toggleDropdown() {
        setDisplayDropdown(d => !d);
    }

    return (
        <div className="header-container">
            
            <header>
                <Link to="/home" className="home-btn">
                    <HomeIcon />
                </Link>
                <h1 className="luckiest-font">
                    {pageName}
                </h1>
                <button className="menu-btn" onClick={toggleDropdown} title="menu">
                    {!displayDropdown ? <MenuIcon /> : <CloseIcon />}
                </button>
            </header>

            <div className={"dropdown-overlay glass" + (displayDropdown ? "" : " solid-snake")} onClick={toggleDropdown}>
                <nav className={"dropdown" + (displayDropdown ? "" : " solid-snake")} onClick={stopPropagation}>
                    <Link className={"dropdown-voice" + (current === Pages.Home ? " current" : "")} to={"/home"}>
                        <PizzaIcon /> Ordina
                    </Link>
                    <Link className={"dropdown-voice" + (current === Pages.Order ? " current" : "")} to={"/order"}>
                        <CartIcon /> Visualizza il tuo ordine
                    </Link>
                    <Link className={"dropdown-voice" + (current === Pages.Check ? " current" : "")} to={"/conto"}>
                        <OrderIcon /> Resoconto ordini
                    </Link>
                    <Link className={"dropdown-voice" + (current === Pages.FC ? " current" : "")} to={"/account"}>
                        <AccountIcon /> Fidelity Card
                    </Link>
                </nav>
            </div>
        </div>
    );
}

export default Header;