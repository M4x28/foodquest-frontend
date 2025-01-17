import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header, { Pages } from "../components/utility/Header.tsx"; // Assicurati di aggiornare il percorso corretto per Header.tsx
import "../bootstrap.css"; // Assicurati di aggiornare il percorso del file bootstrap.css
import { Button } from '../components/input/Button.tsx'; // Importa il componente Button
import Input from "../components/input/Input.tsx"; // Importa il nuovo componente Input
import { userService } from "../services/userService.ts";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
            const userData = localStorage.getItem("user");
            if (userData) {
                navigate("/account");
            }
    }, [navigate]);
    
    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Le password non coincidono");
            return;
        }

        try {
            const username = email.split("@")[0]; // Genera un nome utente base dall'email
            const response = await userService.register(username, email, password);
            console.log(response);
            // Salva la risposta nello stato dell'app (localStorage per questo esempio)
            localStorage.setItem("user", JSON.stringify(response));

            // Reindirizza l'utente su /account
            navigate("/account");
        } catch (error) {
            alert("Errore durante la registrazione. Riprova.");
            console.error(error);
        }
    };

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
                        Crea un nuovo account
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
                        <div className="mb-3">
                            <Input
                                type="password"
                                placeholder="Conferma Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={handleRegister}
                    >
                        REGISTRAZIONE
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
                        onClick={() => {
                            window.location.href = "/login"; // Modifica il percorso in base alla tua app
                        }}
                    >
                        LOGIN
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
