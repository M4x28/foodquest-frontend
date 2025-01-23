import React, { useContext, useEffect, useState } from "react"; // Importa React, i contesti, gli effetti e lo stato
import { useNavigate } from "react-router-dom"; // Hook per la navigazione tra pagine
import { AppStateCtx, backendServer } from "../App.tsx"; // Importa il contesto globale e il server backend
import "../bootstrap.css"; // Importa lo stile di Bootstrap
import Input from "../components/input/Input.tsx"; // Importa il nuovo componente Input
import Header, { Pages } from "../components/utility/Header.tsx"; // Importa il componente Header e il tipo Pages
import "./login-registrazione.css"; // Importa lo stile personalizzato per la pagina di registrazione

// Importa il componente logo
import ToggleButtons from "../components/input/accountButton.tsx";
import Logo from '../components/logo.tsx';


//Formato per la specifica delle classi css: nomefile1.css(nomeclasse-1,nomeclasse-1,...,nomeclasse-n), nomefile2.css(nomeclasse-2,nomeclasse-2,...,nomeclasse-k)


const RegisterPage: React.FC = () => {

    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app

    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [email, setEmail] = useState(""); // Stato per memorizzare l'email
    const [password, setPassword] = useState(""); // Stato per memorizzare la password

    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (userData) {
            navigate("/account"); // Reindirizza alla pagina account se l'utente è già loggato
        }
    }, [navigate, appState.user]); // Esegue l'effetto quando `navigate` o `appState.user` cambiano

    const handleLogin = async () => {
        try {
            const response = await backendServer.user.login(email, password); // Effettua il login con email e password
            const userPoints = (await backendServer.fc.fetchUserFC(response.user.documentId)).Points; // Recupera i punti dell'utente

            // Aggiungi userPoints come proprietà dell'oggetto user
            const userData = {
                ...response,
                user: {
                    ...response.user,
                    Points: userPoints, // Aggiungi i punti all'oggetto user
                },
            };

            updateAppState("user", userData); // Salva i dati dell'utente nello stato globale

            navigate("/account"); // Reindirizza l'utente alla pagina account
        } catch (error) {
            alert("Errore durante il login. Controlla le tue credenziali e riprova."); // Mostra un messaggio d'errore
            console.error(error); // Logga l'errore nella console
        }
    };

    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} /> {/* Aggiunge l'header con il titolo "Fidelity Card" */}
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Layout principale, bootstrap.css(container-fluid,vh-100,d-flex,flex-column,align-items-center,justify-content-center,text-white) */}

                {/* Immagine fissa */}
                <div className="fixed-image">
                    {/* Contenitore per l'immagine fissa, login-registrazione.css(fixed-image) */}
                    <Logo alt="Pizza Logo" className="pizza-logo mb-4" />
                    {/* Logo della pizza, login-registrazione.css(pizza-logo), bootstrap.css(mb-4) */}
                </div>

                {/* Form fisso */}
                <div className="form-container">
                    {/* Contenitore del form, login-registrazione.css(form-container) */}
                    <h2 className="form-title">Accedi al tuo account</h2>
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
