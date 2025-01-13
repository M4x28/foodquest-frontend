import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header, { Pages } from "../components/Header.tsx"; 
import "../bootstrap.css"; 
import { Button } from '../components/Button.tsx'; // Importa il componente Button
import Input from "../components/Input.tsx"; // Importa il nuovo componente Input
import { userService } from "../services/userService.ts";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            navigate("/account");
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await userService.login(email, password);

            // Salva la risposta nello stato dell'app (localStorage per questo esempio)
            localStorage.setItem("user", JSON.stringify(response));

            // Reindirizza l'utente alla pagina account
            navigate("/account");
        } catch (error) {
            alert("Errore durante il login. Controlla le tue credenziali e riprova.");
            console.error(error);
        }
    };

    return (
        <>
            <Header pageName="Fidelity Card" current={Pages.FC} />
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <Input
                                type="password"
                                placeholder="Inserisci Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        onClick={handleLogin}
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
                        onClick={() => navigate("/register")}
                    >
                        REGISTRAZIONE
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;