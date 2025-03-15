import React, { useContext, useEffect, useState } from "react"; // Importa React, i contesti, gli effetti e lo stato
import { useNavigate } from "react-router-dom"; // Hook per la navigazione tra pagine
import { AppStateCtx, backendServer } from "../App.tsx"; // Importa il contesto globale e il server backend
import "../bootstrap.css"; // Importa lo stile di Bootstrap
import Input from "../components/input/Input.tsx"; // Importa il nuovo componente Input
import Header, { Pages } from "../components/utility/Header.tsx"; // Importa il componente Header e il tipo Pages
import "./login-registrazione.css"; // Importa lo stile personalizzato per la pagina di registrazione

import ToggleButtons from "../components/input/accountButton.tsx"; // Pulsanti di toggle per Login e Registrazione
import Logo from "../components/logo.tsx"; // Componente per il logo

// Formato per la specifica delle classi CSS: nomefile1.css(nomeclasse-1, nomeclasse-2, ..., nomeclasse-n)

const RegisterPage: React.FC = () => {
    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app
    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [username, setUsername] = useState(""); // Stato per memorizzare l'email
    const [password, setPassword] = useState(""); // Stato per memorizzare la password
    const [authErr, setAuthErr] = useState(""); // Stato per l'errore dell'username

    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (userData) {
            navigate("/account"); // Reindirizza alla pagina account se l'utente è già loggato
        }
    }, [navigate, appState.user]); // Esegue l'effetto quando `navigate` o `appState.user` cambiano

    const handleLogin = async () => {
        try {
            const response = await backendServer.user.login(username, password); // Effettua il login con email e password
            const userPoints = (
                await backendServer.fc.fetchUserFC(response.user.documentId)
            ).Points; // Recupera i punti dell'utente

            const userData = {
                ...response,
                user: {
                    ...response.user,
                    Points: userPoints, // Aggiungi i punti all'oggetto user
                },
            };

            updateAppState("user", userData); // Salva i dati dell'utente nello stato globale
        } catch (error) {
            setAuthErr("Errore durante il login. Controlla le tue credenziali e riprova."); // Mostra un messaggio d'errore
            console.error(error); // Logga l'errore nella console
        }
    };

    return (
        <>
            <Header pageName="CARTA FEDELTÁ" current={Pages.FC} /> {/* Aggiunge l'header con il titolo "Fidelity Card" */}
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Layout principale, bootstrap.css(container-fluid, vh-100, d-flex, flex-column, align-items-center, justify-content-center, text-white)
            - `container-fluid`: Contenitore fluido al 100%.
            - `vh-100`: Altezza pari al 100% della viewport.
            - `d-flex`: Utilizzo di Flexbox.
            - `flex-column`: Disposizione verticale dei figli.
            - `align-items-center`: Centra il contenuto orizzontalmente.
            - `justify-content-center`: Centra il contenuto verticalmente.
            - `text-white`: Imposta il colore del testo a bianco.
        */}

                {/* Immagine fissa */}
                <div className="fixed-image">
                    {/* Contenitore per l'immagine fissa, login-registrazione.css(fixed-image) */}
                    <Logo alt="Pizza Logo" className="pizza-logo mb-4" />
                    {/* Logo della pizza, login-registrazione.css(pizza-logo), bootstrap.css(mb-4)
              - `pizza-logo`: Classe personalizzata per il logo.
              - `mb-4`: Margine inferiore di 1.5rem.
          */}
                </div>

                {/* Form fisso */}
                <div className="form-container-login">
                    {/* Contenitore del form, login-registrazione.css(form-container) */}
                    <h2 className="form-title ">Accedi al tuo account</h2>
                    {/* Titolo del form, login-registrazione.css(form-title) */}
                    <form className="w-100">
                        {/* Form principale, bootstrap.css(w-100)
                - `w-100`: Larghezza al 100%.*/}
                        <div className="mb-3">
                            {/* Campo di input per l'email, bootstrap.css(mb-3)
                  - `mb-3`: Margine inferiore di 1rem. */}
                            <Input
                                type="text"
                                placeholder="Inserisci l'username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            {/* Campo di input per la password, bootstrap.css(mb-3) */}
                            <Input
                                type="password"
                                placeholder="Inserisci Password"
                                error={authErr}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <ToggleButtons
                    primaryButton="login"
                    onLogin={handleLogin}
                    onRegister={() => navigate("/register")}
                    navigateTo={navigate}
                />
            </div>
        </>
    );
};

export default RegisterPage; // Esporta il componente per l'uso in altre parti dell'applicazione
