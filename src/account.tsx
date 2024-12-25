import React from "react";
import Header, { Pages } from "./components/Header.tsx";
import "./bootstrap.css";
import { ReactComponent as PizzaIcon } from "./assets/pizza.svg"; // Sostituisci con il percorso corretto per l'icona della pizza
import { ReactComponent as LogoutIcon } from "./assets/logout.svg"; // Aggiungi l'icona del logout con il percorso corretto

const AccountPage: React.FC = () => {
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

                {/* Testo centrale */}
                <div
                    className="text-center"
                    style={{
                        maxWidth: "250px",
                        position: "fixed",
                        top: "35%",
                        zIndex: 1,
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
                        Benvenuto Giuseppe
                    </h2>
                    <div
                        className="bg-light text-dark rounded p-3 my-3"
                        style={{
                            //border: "2px solid black", // Bordo nero
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        <h4>
                            Hai{" "}
                            <span className="text-success">4000 punti</span>
                        </h4>
                        <p>
                            Ottieni punti acquistando da noi e poi convertili in
                            sconti esclusivi
                        </p>
                    </div>
                </div>

                {/* Bottoni fissi */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "4%",
                        zIndex: 1,
                        width: "100%",
                        maxWidth: "250px",

                    }}
                >
                    <button
                        className="btn btn-success w-100 mb-2 d-flex align-items-center justify-content-center"
                        style={{
                            border: "2px solid white",
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        <PizzaIcon
                            className="me-2"
                            style={{ width: "20px", height: "20px" }}
                        />
                        INIZIA A ORDINARE
                    </button>
                    <button
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                        style={{
                            border: "2px solid white",
                            fontFamily: "Luckiest Guy, cursive",
                            letterSpacing: "0.1rem",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        <LogoutIcon
                            className="me-2"
                            style={{ width: "20px", height: "20px" }}
                        />
                        LOGOUT
                    </button>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
