import React from 'react';
import pizzaLogo from '../assets/Home/pizza.png';
import Header, { Pages } from "../components/utility/Header.tsx";
import { ReactComponent as OrderIcon } from "../assets/order.svg";
import { ReactComponent as CartIcon } from "../assets/cart.svg";
import CategoriesList from "../components/CategoriesList.tsx";
import { Button } from '../components/input/Button.tsx';
import { useNavigate } from "react-router-dom";
import './home.css'; // Importa il file degli stili

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Header */}
            <Header pageName="HOME" current={Pages.Home} />

            {/* Logo */}
            <div className="logo-container my-5">
                <img src={pizzaLogo} alt="Pizza Logo" />
            </div>

            {/* Menu Items */}
            <CategoriesList />

            {/* Footer */}
            <div className="footer-container">
                <Button
                    variant="success text-LG"
                    size=""
                    onClick={() => navigate("/conto")}
                    className="footer-button"
                >
                    <i className="bi bi-wallet2"></i>
                    <CartIcon />
                    Conto
                </Button>
                <Button
                    variant="success text-LG"
                    size=""
                    className="footer-button"
                    onClick={() => navigate("/order")}
                >
                    <i className="bi bi-cart-fill"></i>
                    <OrderIcon />
                    Ordine
                </Button>
            </div>
        </div>
    );
};

export default Home;
