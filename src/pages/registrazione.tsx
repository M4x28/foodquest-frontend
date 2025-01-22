import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateCtx, backendServer } from "../App.tsx"; // Importa il contesto globale e il server backend
import "../bootstrap.css"; // Assicurati di aggiornare il percorso del file bootstrap.css
import { Button } from '../components/input/Button.tsx'; // Importa il componente Button
import Input from "../components/input/Input.tsx"; // Importa il nuovo componente Input
import Header, { Pages } from "../components/utility/Header.tsx"; // Assicurati di aggiornare il percorso corretto per Header.tsx
import "./login-registrazione.css"; // File CSS per la pagina di registrazione
// Importa il componente logo
import Logo from '../components/logo.tsx';

const RegisterPage: React.FC = () => {

    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app

    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [email, setEmail] = useState(""); // Stato per memorizzare l'email
    const [password, setPassword] = useState(""); // Stato per memorizzare la password
    const [confirmPassword, setConfirmPassword] = useState(""); // Stato per memorizzare la conferma della password

    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (userData) {
            navigate("/account"); // Reindirizza alla pagina account se l'utente è già loggato
        }
    }, [navigate, appState.user]); // Esegue l'effetto quando `navigate` o `appState.user` cambiano

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Le password non coincidono"); // Messaggio d'errore se le password non coincidono
            return;
        }

        try {
            const username = email.split("@")[0]; // Genera un nome utente base dall'email
            const response = await backendServer.user.register(username, email, password); // Registra l'utente
            const fc = await backendServer.fc.createFidelityCard(response.user.documentId); // Crea una carta fedeltà per l'utente

            const userData = {
                ...response,
                user: {
                    ...response.user,
                    Points: fc.Points, // Aggiungi i punti all'oggetto user
                },
            };

            updateAppState("user", userData); // Salva i dati dell'utente nello stato globale

            navigate("/account"); // Reindirizza l'utente alla pagina account
        } catch (error) {
            alert("Errore durante la registrazione. Riprova."); // Messaggio d'errore generico
            console.error(error); // Logga l'errore nella console
        }
    };

    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} /> {/* Header per la pagina di registrazione */}
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Layout principale, bootstrap.css(container-fluid,vh-100,d-flex,flex-column,align-items-center,justify-content-center,text-white) */}

                <div className="fixed-image">
                    {/* Contenitore per l'immagine fissa, login-registrazione.css(fixed-image) */}
                    <Logo alt="Pizza Logo" className="pizza-logo mb-4" />

                    {/* Logo della pizza, login-registrazione.css(pizza-logo), bootstrap.css(mb-4) */}
                </div>

                <div className="form-container">
                    {/* Contenitore del form, login-registrazione.css(form-container) */}
                    <h2 className="form-title">Crea un nuovo account</h2>
                    {/* Titolo del form, login-registrazione.css(form-title) */}
                    <form className="w-100"> {/* Form principale, bootstrap.css(w-100) */}
                        <div className="mb-3">
                            {/* Campo di input per l'email, bootstrap.css(mb-3) */}
                            <Input
                                type="email"
                                placeholder="Inserisci email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            {/* Campo di input per la password, bootstrap.css(mb-3) */}
                            <Input
                                type="password"
                                placeholder="Inserisci Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            {/* Campo di input per la conferma della password, bootstrap.css(mb-3) */}
                            <Input
                                type="password"
                                placeholder="Conferma Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="button-container">
                    {/* Contenitore per i pulsanti, login-registrazione.css(button-container) */}
                    <Button
                        type="submit"
                        variant="success w-100"
                        // Stile Bootstrap per un bottone grande e verde, bootstrap.css(success,w-100)
                        className="action-button mb-2"
                        // Classe personalizzata per stile aggiuntivo, login-registrazione.css(action-button), bootstrap.css(mb-2)
                        size="lg"
                        onClick={handleRegister} // Azione al click: registra un nuovo utente
                    >
                        REGISTRAZIONE
                    </Button>
                    <p className="separator-text">Oppure</p>
                    {/* Testo separatore, login-registrazione.css(separator-text) */}
                    <Button
                        type="button"
                        variant="light w-100"
                        // Stile Bootstrap per un bottone grande e chiaro, bootstrap.css(light,w-100)
                        className="action-button"
                        // Classe personalizzata per stile aggiuntivo, login-registrazione.css(action-button)
                        size="lg"
                        onClick={() => navigate("/login")} // Azione al click: naviga alla pagina di login
                    >
                        LOGIN
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
