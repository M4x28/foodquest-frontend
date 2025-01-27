import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateCtx, backendServer } from "../App.tsx"; // Importa il contesto globale e il server backend
import "../bootstrap.css"; // Assicurati di aggiornare il percorso del file bootstrap.css
import Input from "../components/input/Input.tsx"; // Importa il nuovo componente Input
import Header, { Pages } from "../components/utility/Header.tsx"; // Assicurati di aggiornare il percorso corretto per Header.tsx
import "./login-registrazione.css"; // File CSS per la pagina di registrazione
// Importa il componente logo
//test
import ToggleButtons from "../components/input/accountButton.tsx";
import Logo from '../components/logo.tsx';

const RegisterPage: React.FC = () => {
    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app

    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [username, setUsername] = useState(""); // Stato per memorizzare l'username
    const [password, setPassword] = useState(""); // Stato per memorizzare la password
    const [confirmPassword, setConfirmPassword] = useState(""); // Stato per memorizzare la conferma della password
    const [usernameError, setUsernameError] = useState(""); // Stato per l'errore dell'username
    const [passwordError, setPasswordError] = useState(""); // Stato per l'errore della password
    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (userData) {
            navigate("/account"); // Reindirizza alla pagina account se l'utente è già loggato
        }
    }, [navigate, appState.user]); // Esegue l'effetto quando `navigate` o `appState.user` cambiano

    const handleRegister = async () => {
        let hasError = false;

        if (username.length < 3) {
            setUsernameError("Il nome utente deve essere di almeno 3 caratteri.");
            hasError = true;
        }

        const validatePassword = (password: string) => {
            const lengthCheck = password.length >= 6;
            const upperCaseCheck = /[A-Z]/.test(password);
            const lowerCaseCheck = /[a-z]/.test(password);
            const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            return lengthCheck && upperCaseCheck && lowerCaseCheck && specialCharCheck;
        };

        if (!validatePassword(password)) {
            setPasswordError("Lunghezza almeno 6 caratteri e contenente una maiuscola, una minuscola e un carattere speciale.");
            hasError = true;
        }

        if (password !== confirmPassword) {
            alert("Le password non coincidono");
            hasError = true;
        }

        if (hasError) return;

        try {
            const email = `${username}@i.i`;
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

                <div className="form-container-register">
                    {/* Contenitore del form, login-registrazione.css(form-container) */}
                    <h2 className="form-title">Crea un nuovo account</h2>
                    {/* Titolo del form, login-registrazione.css(form-title) */}
                    <form className="w-100"> {/* Form principale, bootstrap.css(w-100) */}
                        <div className="mb-3">
                            {/* Campo di input per l'username, bootstrap.css(mb-3) */}
                            <Input
                                type="text"
                                placeholder="Inserisci username"
                                value={username}
                                error={usernameError}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            {/* Campo di input per la password, bootstrap.css(mb-3) */}
                            <Input
                                type="password"
                                placeholder="Inserisci Password"
                                value={password}
                                error={passwordError}
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

                <ToggleButtons
                    primaryButton="register"
                    onLogin={() => navigate("/login")}
                    onRegister={handleRegister}
                    navigateTo={navigate}
                />
            </div>
        </>
    );
};

export default RegisterPage;
