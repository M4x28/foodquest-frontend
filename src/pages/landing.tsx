import React, { useContext, useEffect, useState } from 'react';
import { AppStateCtx, backendServer } from "../App.tsx";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/input/Button.tsx';
import { toErrorPage } from '../utility/generic.ts';
import Input from '../components/input/Input.tsx';

import mario from "../assets/Home/mario.png";
import bigMario from "../assets/Home/big-mario.png";
import pizza from '../assets/Home/pizza.png';

import "./page.css";
import "./landing.css";

/**
 * Componente per la pagina di atterraggio (Landing Page).
 * Consente all'utente di accedere tramite un codice di accesso al tavolo.
 */
function Landing() {

    const [appState,updateAppState] = useContext(AppStateCtx);
    // eslint-disable-next-line
    const [param,_] = useSearchParams();

    //See if there are input in the query, if so not show input field and automatically load table
    const inputInQuery = param.has("accessCode");

    const [accessCode,setAccessCode] = useState<string>(param.get("accessCode") || "");
    const [error,setError] = useState<string|undefined>();      //Error message to display on input

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [name, setName] = useState("Pizzeria da Mimmo"); // Nome del ristorante
    // eslint-disable-next-line
    const [logoUrl, setLogoUrl] = useState(pizza); // URL del logo del ristorante

    //Use accessCode to log to the table
    const accessTable = () => {
        return backendServer.table.logToTable(accessCode)
            .then(table => {
                table.accessCode = accessCode; // Assegna il codice di accesso al tavolo
                updateAppState("table", table); // Aggiorna lo stato globale con i dettagli del tavolo
            });
    };

    /**
     * Effettua automaticamente l'accesso al tavolo se il codice è presente nella query string.
     */
    useEffect(() => {
        if(inputInQuery)    //If input was provided in query access table
            accessTable()
            .catch(e => {
                console.log(e)
                toErrorPage(navigate);
            })
    },[]);

    //Tries to log to table when accessCode in inserted manually
    const tryLog = () => {
        const trimCode = accessCode.trim(); // Rimuove eventuali spazi bianchi dal codice
        if (trimCode !== "") {
            accessTable()
            .then(() => {
                navigate('/home')
            })
            .catch((e) => {
                console.log(e);
                //Display error message to user
                setError("Il codice inserito non è valido");
            })
        }
    }

    //Navigate to home, only if login was successful
    const toHome = () => {
        if (appState.table) {
            navigate('/home');
        }
    };

    //Handle user input to change accessCode (when maually inserted)
    const handleCodeChange = (e) => {
        setAccessCode(e.target.value)
    }

    //Set cta variant based on the login state
    const btnVariant = inputInQuery ? (appState.table ? "success" : "secondary") : (accessCode.trim() !== "" ? "success" : "secondary");

    return (
        <>
            {/* Intestazione della pagina */}
            <header className='page-box-bg'>
                <h4 id="table" className='luckiest-font'>
                    Tavolo {appState.table ? appState.table.number : "..."} {/* Mostra il numero del tavolo */}
                </h4>
                <div id='welcome-msg'>
                    {/* Mostra l'immagine di Mario (grande o piccola in base alla larghezza dello schermo) */}
                    <picture>
                        <source media='(min-width: 500px)' srcSet={bigMario}></source>
                        <source media="(max-width: 499px)" srcSet={mario}></source>
                        <img src={mario} alt='Mascotte foodquest'></img>
                    </picture>
                    <h3>Foodquest ti da il benvenuto da</h3> {/* Messaggio di benvenuto */}
                </div>
            </header>

            {/* Sezione del logo */}
            <section id="logo">
                <img src={logoUrl} alt={"Logo " + name} /> {/* Mostra il logo */}
                <h1>{name}</h1> {/* Mostra il nome del ristorante */}
            </section>

            {/* Sezione di call-to-action */}
            <section className='call-to-action'>
            {!inputInQuery && //Display input field only if was not provided in query
                <Input type='text' placeholder='Inserisci il codice' className='cta-input' 
                    style={{maxWidth: "400px",width:"80vw"}}
                    error={error} value={accessCode} onChange={handleCodeChange}/>
            }
            <Button
                variant={btnVariant}
                size="lg"
                className='cta-btn'
                onClick={inputInQuery ? toHome : tryLog}>
                        {inputInQuery ? "INIZIA A ORDINARE" : "ACCEDI"}
            </Button>
            </section>               
        </>
    );
}

export default Landing;