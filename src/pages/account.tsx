import React, { useContext, useEffect, useRef, useState } from "react"; // Importa React, i contesti, gli effetti, lo stato e useRef
import { useNavigate } from "react-router-dom"; // Hook per la navigazione tra pagine
import { AppStateCtx } from "../App.tsx"; // Importa il contesto globale dell'applicazione
import { ReactComponent as LogoutIcon } from "../assets/logout.svg"; // Importa il file SVG dell'icona logout
import { ReactComponent as PizzaIcon } from "../assets/pizza.svg"; // Importa il file SVG dell'icona pizza
import "../bootstrap.css"; // Importa lo stile di Bootstrap
import BoxPunti from "../components/card/pointCard.tsx"; // Importa il componente BoxPunti
import { Button } from '../components/input/Button.tsx'; // Importa il componente Button personalizzato
import Logo from '../components/logo.tsx'; // Importa il componente Logo
import Header, { Pages } from "../components/utility/Header.tsx"; // Importa il componente Header e il tipo Pages
import "./account.css"; // Importa lo stile personalizzato per la pagina account

const AccountPage: React.FC = () => {
    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app
    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [username, setUsername] = useState<string>(""); // Stato per memorizzare il nome utente
    const [points, setPoints] = useState<number>(0); // Stato per memorizzare i punti dell'utente
    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null); // Riferimento per il timeout di inattività

    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (!userData) {
            navigate("/login"); // Reindirizza alla pagina di login se non esiste un utente loggato
            return; // Termina l'esecuzione del codice successivo
        }

        setUsername(userData.user.username || "Utente"); // Imposta il nome utente o un valore di default
        setPoints(userData.user.Points || 0); // Imposta i punti dell'utente o un valore di default

        const resetInactivityTimeout = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current); // Resetta il timeout di inattività
            }
            inactivityTimeout.current = setTimeout(() => {
                handleLogout(); // Disconnette l'utente dopo 30 minuti di inattività
            }, 30 * 60 * 1000); // 30 minuti in millisecondi
        };

        const handleLogout = () => {
            updateAppState("user", undefined); // Rimuove l'utente dallo stato globale
            navigate("/login"); // Reindirizza alla pagina di login
        };

        const events = ["mousemove", "keydown", "click"]; // Eventi che resettano il timeout di inattività
        events.forEach(event => window.addEventListener(event, resetInactivityTimeout));

        resetInactivityTimeout(); // Inizializza il timeout di inattività

        return () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current); // Pulisce il timeout di inattività al dismount del componente
            }
            events.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
        };
    }, [navigate, appState.user, updateAppState]);

    const handleLogout = () => {
        updateAppState("user", undefined); // Rimuove l'utente dallo stato globale
        navigate("/login"); // Reindirizza alla pagina di login
    };
    return (
        <>
            <Header pageName="FIDELITY CARD" current={Pages.FC} /> {/* Aggiunge l'header con il titolo "FIDELITY CARD" */}
            <div className="container-fluid vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                {/* Sezione principale, layout a schermo intero con Bootstrap, bootstrap.css(container-fluid,vh-100,d-flex,flex-column,align-items-center,justify-content-center,text-white) */}

                {/* Immagine fissa */}
                <div className="fixed-image">
                    {/* Contenitore per l'immagine fissa, account.css(fixed-image) */}
                    <Logo alt="Pizza Logo" className="pizza-logo mb-4" />

                    {/* Logo della pizza, account.css(pizza-logo), bootstrap.css(mb-4) */}
                </div>

                {/* Usa il componente BoxPunti */}
                <BoxPunti username={username} points={points} />

                {/* Bottoni */}
                <div className="button-container">
                    {/* Contenitore per i bottoni, account.css(button-container) */}
                    <Button
                        variant="success w-100"
                        // Stile Bootstrap per un bottone grande e verde, bootstrap.css(success,w-100)
                        className="action-button mb-2"
                        // Classe personalizzata per stile aggiuntivo, account.css(action-button), bootstrap.css(mb-2)
                        size="lg" // Dimensione grande del bottone
                        onClick={() => window.location.href = "/home"}
                    // Azione al click: naviga alla home
                    >
                        <PizzaIcon className="icon me-2" />
                        {/* Icona della pizza, account.css(icon), bootstrap.css(me-2) */}
                        ORDINA {/* Testo del bottone */}
                    </Button>
                    <Button
                        variant="danger w-100"
                        // Stile Bootstrap per un bottone grande e rosso, bootstrap.css(danger,w-100)
                        className="action-button"
                        // Classe personalizzata per stile aggiuntivo, account.css(action-button)
                        size="lg" // Dimensione grande del bottone
                        onClick={handleLogout}
                    // Azione al click: logout e naviga al login
                    >
                        <LogoutIcon className="icon me-2" />
                        {/* Icona del logout, account.css(icon), bootstrap.css(me-2) */}
                        LOGOUT {/* Testo del bottone */}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AccountPage; // Esporta il componente per l'uso in altre parti dell'applicazione
