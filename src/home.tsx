import React from 'react';
import pizzaLogo from './assets/Home/pizza.png'; // Percorso dell'immagine del logo
import { Button } from './components/Button.tsx';

const Home: React.FC = () => {
    return (
        <div
            className="d-flex flex-column align-items-center"
        >
            {/* Header */}
            <div
                className="d-flex justify-content-between align-items-center w-100"
                style={{
                    backgroundColor: 'white',
                    padding: '10px 20px',
                    borderBottom: '2px solid #ccc',
                }}
            >
                <i className="bi bi-house-door-fill" style={{ fontSize: '2rem', color: '#28a745' }}></i>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>HOME</h1>
                <i className="bi bi-list" style={{ fontSize: '2rem', color: '#28a745' }}></i>
            </div>

            {/* Logo */}
            <div className="my-4">
                <img
                    src={pizzaLogo}
                    alt="Pizza Logo"
                    style={{ width: '150px', height: '150px' }}
                />
            </div>

            {/* Menu Items */}
            <div className="d-flex flex-column align-items-center w-100 px-3">
                {['PIZZE', 'ANTIPASTI', 'BEVANDE', 'DOLCI'].map((item, index) => (
                    <div
                        key={index}
                        className="btn btn-light text-dark fw-bold mb-3"
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            padding: '15px',
                            borderRadius: '10px',
                            fontSize: '1.2rem',
                            border: '2px solid #ccc',
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center w-100">
                <Button
                    variant="success"
                    size="lg"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontSize: '1rem',
                    }} onClick={undefined}                >
                    <i className="bi bi-wallet2" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
                    <span className="ms-2">Conto</span>
                </Button>
                <Button
                    variant="success"
                    size="lg"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontSize: '1rem',
                    }} onClick={undefined}                >
                    <i className="bi bi-cart-fill" style={{ fontSize: '1.5rem', color: '#28a745' }}></i>
                    <span className="ms-2">Ordine</span>
                </Button>
            </div>
        </div>
    );
};

export default Home;