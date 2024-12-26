import React from 'react';
import pizza from './assets/Home/pizza.png';
import { Button } from './components/Button.tsx'; // Importa il componente Button

const LandingPage: React.FC = () => {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-between text-center p-3"
            style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
        >
            {/* Intestazione con il numero del tavolo */}
            <div className="text-end w-100" style={{ height: '200px' }}>
                <span className="badge bg-secondary p-3" style={{ fontSize: '1.2rem' }}>
                    TAVOLO 4
                </span>
            </div>

            {/* Contenuto centrale */}
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <h1 className="mb-4 text-center" style={{ fontSize: '3.7rem', fontWeight: 'bold', lineHeight: '1.2' }}>
                    Pizzeria <br /> da <br /> Mimmo
                </h1>
                <img
                    src={pizza}
                    alt="Pizzeria Logo"
                    style={{ width: '400px', height: '500px', marginBottom: '20px' }}
                />
            </div>

            {/* Bottone fisso in basso */}
            <div
                className="position-fixed w-100"
                style={{
                    bottom: '20px',
                    left: '0',
                    zIndex: 1000,
                }}
            >
                <div className="d-flex justify-content-center">
                    <Button
                        variant="success"
                        size="lg"
                        style={{
                            borderRadius: '50px',
                            padding: '15px 30px',
                            fontSize: '1.5rem',
                        }}
                    >
                        <i className="bi bi-play-circle-fill me-2"></i> INIZIA A ORDINARE
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
