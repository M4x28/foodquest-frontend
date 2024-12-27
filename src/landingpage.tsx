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
                <span className="badge p-3 bg-white" style={{
                    fontFamily: "Luckiest Guy, cursive",
                    fontSize: "1.2rem",
                    letterSpacing: "0.1rem",
                    border: "2px solid #000", // Bordo nero
                    borderRadius: "8px", // Angoli arrotondati
                }}>
                    TAVOLO 4
                </span>
            </div>

            {/* Contenuto centrale */}
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
                style={{
                    position: "fixed",
                    top: "15%",
                    zIndex: 1,
                    width: "100%",
                    maxWidth: "250px",
                }}
            >
                <h1 className="mb-4 text-center"
                    style={{
                        fontFamily: "Luckiest Guy, cursive",
                        fontSize: "3rem",
                        letterSpacing: "0.1rem",
                    }}>
                    Pizzeria <br /> da <br /> Mimmo
                </h1>
            </div>
            <div style={{
                position: "fixed",
                top: "30%",
                zIndex: 1,


            }}>
                <img
                    src={pizza}
                    alt="Pizzeria Logo"
                    style={{ width: '400px', height: '450px' }}
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
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            border: "4px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                            fontSize: "1.8rem", // Adattamento dinamico
                        }} onClick={undefined}                    >
                        INIZIA A ORDINARE
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
