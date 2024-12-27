import React from "react";
import Header, { Pages } from "./components/Header.tsx"; 
import "./bootstrap.css"; 
import { Button } from './components/Button.tsx'; // Importa il componente Button
import Input from "./components/Input.tsx"; // Importa il nuovo componente Input

const RegisterPage: React.FC = () => {
    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} />
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Immagine fissa */}
                <div
                    style={{
                        position: "fixed",
                        top: "8vh",
                        zIndex: 1,
                    }}
                >
                    <img
                        src="/pizza.png" // Sostituisci con il percorso corretto del logo
                        alt="Pizza Logo"
                        className="mb-4"
                        style={{
                            width: "70vw", // Adattamento dinamico
                            maxWidth: "250px", // Limite massimo
                            height: "auto",
                        }}
                    />
                </div>

                {/* Form fisso */}
                <div
                    className="text-center"
                    style={{
                        position: "fixed",
                        top: "35vh",
                        zIndex: 1,
                        width: "90vw", // Adattamento dinamico
                        maxWidth: "300px", // Limite massimo
                    }}
                >
                    <h2
                        className="text-white"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            fontSize: "1.5rem",
                            letterSpacing: "0.1rem",
                        }}
                    >
                        Accedi al tuo account
                    </h2>
                    <form className="w-100">
                        <div className="mb-3">
                            <Input
                                type="email"
                                placeholder="Inserisci email"

                            />
                        </div>
                        <div className="mb-3">
                            <Input
                                type="password"
                                placeholder="Inserisci Password"

                            />
                        </div>
                        
                    </form>
                </div>

                {/* Pulsanti fissi */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "5vh",
                        zIndex: 1,
                        width: "90vw", // Adattamento dinamico
                        maxWidth: "300px", // Limite massimo
                    }}
                >
                    <Button
                        type="submit"
                        variant="success w-100"
                        size="lg"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                            fontSize: "1rem", // Adattamento dinamico
                        }}
                        onClick={undefined}
                    >
                        LOGIN
                    </Button>
                    <p
                        className="text-white text-center mb-1"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            fontSize: "1rem", // Adattamento dinamico
                        }}
                    >
                        Oppure
                    </p>
                    <Button
                        type="button"
                        variant="light w-100"
                        size="lg"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                            fontSize: "1rem", // Adattamento dinamico
                        }}
                        onClick={undefined}
                    >
                        REGISTRAZIONE
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
