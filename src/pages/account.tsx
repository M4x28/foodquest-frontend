import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header, { Pages } from "../components/Header.tsx";
import "../bootstrap.css";
import { ReactComponent as PizzaIcon } from "../assets/pizza.svg"; // Sostituisci con il percorso corretto per l'icona della pizza
import { ReactComponent as LogoutIcon } from "../assets/logout.svg"; // Aggiungi l'icona del logout con il percorso corretto
import { Button } from '../components/Button.tsx';

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        const parsedData = JSON.parse(userData);
        setUsername(parsedData.user.username || "Utente");
        setPoints(parsedData.user.Points || 0);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login"; // Reindirizza alla pagina di login
    };

    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} />
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Immagine fissa */}
                <div style={{ position: "fixed", top: "10%", zIndex: 1 }}>
                    <img
                        src="/pizza.png"
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
                        Benvenut@ {username}
                    </h2>
                    <div
                        className="bg-light text-dark rounded p-3 my-3"
                        style={{
                            //border: "2px solid black", // Bordo nero
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
                        }}
                    >
                        <h4>
                            Hai <span className="text-success">{points} punti</span>
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
                        maxWidth: "350px",
                    }}
                >
                    <Button
                        variant="success w-100 text-LG"
                        className="mb-2 d-flex align-items-center justify-content-center"
                        size="lg"
                        style={{
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        onClick={() => window.location.href = "/home"}
                    >
                        <PizzaIcon
                            className="me-2"
                            style={{ width: "20px", height: "20px" }}
                        />
                        INIZIA A ORDINARE
                    </Button>
                    <Button
                        variant="danger w-100 text-LG"
                        className="d-flex align-items-center justify-content-center"
                        size="lg"
                        style={{
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        onClick={handleLogout}
                    >
                        <LogoutIcon
                            className="me-2"
                            style={{ width: "20px", height: "20px" }}
                        />
                        LOGOUT
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
