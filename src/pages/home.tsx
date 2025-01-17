import React, { useEffect, useState } from 'react';
import axios from 'axios';
import pizzaLogo from '../assets/Home/pizza.png';
import Header, { Pages } from "../components/Header.tsx";
import { ReactComponent as OrderIcon } from "../assets/order.svg";
import { ReactComponent as CartIcon } from "../assets/cart.svg";
import CategoriesList from "../components/CategoriesList.tsx";
import { Button } from '../components/Button.tsx';
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column align-items-center">
            {/* Header */}
            <Header pageName="HOME" current={Pages.Home} />

            {/* Logo */}
            <div className="my-5">
                <img
                    src={pizzaLogo}
                    alt="Pizza Logo"
                    style={{ width: '220px', height: '260px' }}
                />
            </div>


            {/* Menu Items */}
            <CategoriesList></CategoriesList>

            {/* Footer */}
            <div
                className="position-fixed w-100 px-3 d-flex justify-content-between"
                style={{
                    bottom: '20px', // Posizionamento in fondo
                    left: '0',
                    zIndex: 1000,
                }}
            >
                <Button
                    variant="success text-LG"
                    size=""
                    style={{
                        border: "2px solid white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        fontSize: "1.8rem", // Adattamento dinamico
                        marginRight: "10px", // Spaziatura tra i pulsanti
                    }}
                    onClick={undefined}
                >
                    <i className="bi bi-wallet2" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
                    <CartIcon
                        className="me-2"
                        style={{ width: "30px", height: "30px" }}
                    />
                    Conto
                </Button>
                <Button
                    variant="success text-LG"
                    size=""
                    style={{
                        border: "2px solid white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        fontSize: "1.8rem", // Adattamento dinamico
                        marginLeft: "10px", // Spaziatura tra i pulsanti
                    }}
                    onClick={() => navigate("/order")}
                >
                    <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
                    <OrderIcon
                        className="me-2"
                        style={{ width: "30px", height: "30px" }}
                    />
                    Ordine
                </Button>
            </div>
        </div>
    );
};

export default Home;
