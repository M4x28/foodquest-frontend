import React from "react";
import Header, { Pages } from "./components/Header.tsx"; // Assicurati di aggiornare il percorso corretto per Header.tsx
import "./bootstrap.css"; // Assicurati di aggiornare il percorso del file bootstrap.css

const RegisterPage: React.FC = () => {
    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} />
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Immagine fissa */}
                <div style={{ position: "fixed", top: "10%", zIndex: 1 }}>
                    <img
                        src="/pizza.png" // Sostituisci con il percorso corretto del logo
                        alt="Pizza Logo"
                        className="mb-4"
                        style={{ width: "160px", height: "180px" }}
                    />
                </div>

                {/* Form fisso */}
                <div
                    className="text-center"
                    style={{
                        position: "fixed",
                        top: "35%",
                        zIndex: 1,
                        width: "100%",
                        maxWidth: "250px",
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
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Inserisci email"
                                style={{
                                    fontFamily: "Luckiest Guy, cursive",
                                    letterSpacing: "0.1rem",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Inserisci Password"
                                style={{
                                    fontFamily: "Luckiest Guy, cursive",
                                    letterSpacing: "0.1rem",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                                }}
                            />
                        </div>

                    </form>
                </div>

                {/* Pulsanti fissi */}
                <div style={{ position: "fixed", bottom: "1%", zIndex: 1, width: "100%", maxWidth: "250px" }}>
                    <button
                        type="submit"
                        className="btn btn-success w-100"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        LOGIN
                    </button>
                    <p
                        className="text-white text-center mb-0"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                        }}
                    >
                        Oppure
                    </p>
                    <button
                        type="button"
                        className="btn btn-light w-100"
                        style={{
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        REGISTRATI
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
