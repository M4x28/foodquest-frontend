import React from 'react';
import pizzaLogo from './assets/Home/pizza.png';
import Header, { Pages } from "./components/Header.tsx";
import { ReactComponent as OrderIcon } from "./assets/order.svg";
import { ReactComponent as CartIcon } from "./assets/cart.svg";
import { Button } from './components/Button.tsx';

const Home: React.FC = () => {
    return (
        <div
            className="d-flex flex-column align-items-center"
        >
            {/* Header */}
            <Header pageName="HOME" current={Pages.NULL} />

            {/* Logo */}
            <div className="my-5"> {/* Aggiunto margine per abbassare l'immagine */}
                <img
                    src={pizzaLogo}
                    alt="Pizza Logo"
                    style={{ width: '200px', height: '240px' }}
                />
            </div>

            {/* Menu Items */}
            <div className="d-flex flex-column align-items-center w-100 px-3">
                {['PIZZE', 'ANTIPASTI', 'BEVANDE', 'DOLCI'].map((item, index) => (
                    <Button
                        key={index}
                        variant="light text-dark fw-bold text-LG"
                        size="lg"
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            padding: '15px',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            border: '2px solid #ccc',
                            marginBottom: '15px', // Spaziatura tra i pulsanti
                        }} onClick={undefined}                    >
                        {item}
                    </Button>
                ))}
            </div>

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
                        fontSize: "1.3rem", // Adattamento dinamico
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
                        fontSize: "1.3rem", // Adattamento dinamico
                        marginLeft: "10px", // Spaziatura tra i pulsanti
                    }}
                    onClick={undefined}
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
