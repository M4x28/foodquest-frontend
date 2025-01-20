import React, { useState } from "react";
import { Link } from "react-router-dom"; // Componente per la navigazione tra le pagine
import { stopPropagation } from "../../utility/generic.ts"; // Funzione per fermare la propagazione degli eventi

// Icone SVG importate per l'interfaccia utente
import { ReactComponent as HomeIcon } from "../../assets/home.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as PizzaIcon } from "../../assets/pizza.svg";
import { ReactComponent as CartIcon } from "../../assets/shoppingCart.svg";
import { ReactComponent as OrderIcon } from "../../assets/order.svg";
import { ReactComponent as AccountIcon } from "../../assets/account.svg";

import "../../App.css"; // Stili globali
import "./Header.css"; // Stili specifici del componente

// Enumerazione delle pagine supportate dall'app
export enum Pages {
    Home,   // Pagina Home
    Order,  // Pagina Ordini
    Check,  // Pagina Resoconto Ordini
    FC      // Pagina Fidelity Card
}

// Interfaccia delle proprietà del componente
interface PropType {
    pageName: string;  // Nome della pagina attuale
    current: Pages;    // Pagina corrente selezionata
}

/**
 * Componente Header.
 * Rappresenta l'intestazione con un menu a tendina per la navigazione.
 */
function Header({ pageName, current }: PropType) {

    // Stato per gestire la visibilità del menu a tendina
    const [displayDropdown, setDisplayDropdown] = useState<boolean>(false);

    /**
     * Funzione per alternare la visibilità del menu a tendina.
     * @param event - Evento di clic (non utilizzato direttamente)
     */
    function toggleDropdown(event) {
        setDisplayDropdown(d => !d);
    }

    return (
        <div className="header-container">
            {/* Intestazione con pulsante Home, titolo e menu */}
            <header>
                <Link to="/home" className="home-btn">
                    <HomeIcon /> {/* Icona Home */}
                </Link>
                <h1 className="luckiest-font">
                    {pageName} {/* Nome della pagina */}
                </h1>
                <button className="menu-btn" onClick={toggleDropdown} title="menu">
                    {/* Mostra l'icona del menu o quella per chiudere in base allo stato */}
                    {!displayDropdown ? <MenuIcon /> : <CloseIcon />}
                </button>
            </header>

            {/* Overlay per il menu a tendina */}
            <div className={"dropdown-overlay glass" + (displayDropdown ? "" : " solid-snake")} onClick={toggleDropdown}>
                <nav className={"dropdown" + (displayDropdown ? "" : " solid-snake")} onClick={stopPropagation}>
                    {/* Link per ciascuna pagina */}
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