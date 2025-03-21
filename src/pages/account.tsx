import React, { useContext, useEffect, useState } from "react"; // Importa React, i contesti, gli effetti e lo stato
import { useNavigate } from "react-router-dom"; // Hook per la navigazione tra pagine
import { AppStateCtx } from "../App.tsx"; // Importa il contesto globale dell'applicazione
import { ReactComponent as LogoutIcon } from "../assets/logout.svg"; // Importa il file SVG dell'icona logout
import { ReactComponent as PizzaIcon } from "../assets/pizza.svg"; // Importa il file SVG dell'icona pizza
import "../bootstrap.css"; // Importa lo stile di Bootstrap
import { Button } from '../components/input/Button.tsx'; // Importa il componente Button personalizzato
import Header, { Pages } from "../components/utility/Header.tsx"; // Importa il componente Header e il tipo Pages
import "./account.css"; // Importa lo stile personalizzato per la pagina account
// Importa il componente logo
import BoxPunti from "../components/card/pointCard.tsx";
import Logo from '../components/logo.tsx';

//Formato per la specifica delle classi css: nomefile1.css(nomeclasse-1,nomeclasse-1,...,nomeclasse-n), nomefile2.css(nomeclasse-2,nomeclasse-2,...,nomeclasse-k)

const AccountPage: React.FC = () => {
    const [appState, updateAppState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app

    const navigate = useNavigate(); // Inizializza il navigatore per il reindirizzamento
    const [username, setUsername] = useState<string>(""); // Stato per memorizzare il nome utente
    const [points, setPoints] = useState<number>(0); // Stato per memorizzare i punti dell'utente

    useEffect(() => {
        const userData = appState.user; // Estrae i dati dell'utente dallo stato globale
        if (!userData) {
            navigate("/login"); // Reindirizza alla pagina di login se non esiste un utente loggato
            return; // Termina l'esecuzione del codice successivo
        }

        setUsername(userData.user.username || "Utente"); // Imposta il nome utente o un valore di default
        setPoints(userData.user.Points || 0); // Imposta i punti dell'utente o un valore di default
    }, [navigate, appState.user]); // Esegue l'effetto quando `navigate` o `appState.user` cambiano

    const handleLogout = () => {
        updateAppState("user", undefined); // Rimuove l'utente dallo stato globale
        navigate("/login"); // Reindirizza alla pagina di login
    };

    return (
        <>
            <Header pageName="CARTA FEDELTÁ" current={Pages.FC} /> {/* Aggiunge l'header con il titolo "FIDELITY CARD" */}
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
                        variant="dark w-100"
                        // Stile Bootstrap per un bottone grande e rosso, bootstrap.css(danger,w-100)
                        className="action-button"
                        // Classe personalizzata per stile aggiuntivo, account.css(action-button)
                        size="lg" // Dimensione grande del bottone
                        onClick={handleLogout}
                    // Azione al click: logout e naviga al login
                    >
                        <LogoutIcon className="icon me-2" />
                        {/* Icona del logout, account.css(icon), bootstrap.css(me-2) */}
                        ESCI {/* Testo del bottone */}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AccountPage; // Esporta il componente per l'uso in altre parti dell'applicazione
