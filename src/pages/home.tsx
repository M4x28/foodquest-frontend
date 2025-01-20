import React from 'react';

// Importa l'immagine del logo della pizza
import pizzaLogo from '../assets/Home/pizza.png';

// Importa il componente Header e le pagine disponibili
import Header, { Pages } from "../components/utility/Header.tsx";

// Importa le icone per "Ordine" e "Conto"
import { ReactComponent as OrderIcon } from "../assets/order.svg";
import { ReactComponent as CartIcon } from "../assets/cart.svg";

// Importa il componente per la lista delle categorie
import CategoriesList from "../components/CategoriesList.tsx";

// Importa il componente Button per i pulsanti
import { Button } from '../components/input/Button.tsx';

// Hook per la navigazione
import { useNavigate } from "react-router-dom";

// Importa il file di stile della home page
import './home.css';

/**
 * Componente per la Home Page.
 * Contiene il logo, la lista delle categorie e i pulsanti per navigare verso il conto o l'ordine.
 */
const Home: React.FC = () => {
    const navigate = useNavigate(); // Hook per la navigazione

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Intestazione della pagina */}
            <Header pageName="HOME" current={Pages.Home} />

            {/* Contenitore del logo */}
            <div className="logo-container my-5">
                <img src={pizzaLogo} alt="Pizza Logo" /> {/* Mostra il logo della pizza */}
            </div>

            {/* Lista delle categorie */}
            <CategoriesList />

            {/* Contenitore del footer con i pulsanti */}
            <div className="footer-container">
                {/* Pulsante per navigare alla pagina del conto */}
                <Button
                    variant="success text-LG" // Stile del pulsante
                    size=""
                    onClick={() => navigate("/conto")} // Naviga alla pagina "Conto"
                    className="footer-button"
                >
                    <i className="bi bi-wallet2"></i> {/* Icona del portafoglio */}
                    <CartIcon /> {/* Icona del conto */}
                    Conto
                </Button>

                {/* Pulsante per navigare alla pagina degli ordini */}
                <Button
                    variant="success text-LG" // Stile del pulsante
                    size=""
                    className="footer-button"
                    onClick={() => navigate("/order")} // Naviga alla pagina "Ordine"
                >
                    <i className="bi bi-cart-fill"></i> {/* Icona del carrello */}
                    <OrderIcon /> {/* Icona dell'ordine */}
                    Ordine
                </Button>
            </div>
        </div>
    );
};

export default Home;