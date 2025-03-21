import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppStateCtx, backendServer } from "../App.tsx";
import { Button } from '../components/input/Button.tsx';
import Input from '../components/input/Input.tsx';
import { handleSubmitFactory, toErrorPage } from '../utility/generic.ts';


// Importa il componente logo
import Logo from '../components/logo.tsx';


import LoadingPopup from '../components/popup/LoadingPopup.tsx';
import useLoading from '../utility/useLoading.ts';
import "./landing.css";
import "./page.css";

/**
 * Componente per la pagina di atterraggio (Landing Page).
 * Consente all'utente di accedere tramite un codice di accesso al tavolo.
 */
function Landing() {

    const [appState, updateAppState] = useContext(AppStateCtx);
    const [loading, start, end] = useLoading(1000, false);
    // eslint-disable-next-line
    const [param, _] = useSearchParams();

    //See if there are input in the query, if so not show input field and automatically load table
    const inputInQuery = param.has("accesscode");

    const [accesscode, setaccesscode] = useState<string>(param.get("accesscode") || "");
    const [error, setError] = useState<string | undefined>();      //Error message to display on input

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [name] = useState("Pizzeria da Mimmo"); // Nome del ristorante
    // eslint-disable-next-line

    //Use accesscode to log to the table
    const accessTable = () => {
        return backendServer.table.logToTable(accesscode)
            .then(table => {
                table.accessCode = accesscode; // Assegna il codice di accesso al tavolo
                updateAppState("table", table); // Aggiorna lo stato globale con i dettagli del tavolo
            });
    };

    /**
     * Effettua automaticamente l'accesso al tavolo se il codice è presente nella query string.
     */
    useEffect(() => {
        if (inputInQuery)    //If input was provided in query access table
            accessTable()
                .catch(e => {
                    console.log(e)
                    toErrorPage(navigate);
                })
    }, []); // eslint-disable-line

    //Tries to log to table when accesscode in inserted manually
    const tryLog = () => {
        const trimCode = accesscode.trim(); // Rimuove eventuali spazi bianchi dal codice
        if (trimCode !== "") {
            start();
            accessTable()
                .then(() => {
                    navigate('/home')
                    end();
                })
                .catch((e) => {
                    console.log(e);
                    end();
                    if (e.status == 401) {
                        //Display error message to user
                        setError("Il codice inserito non è valido");
                    } else {
                        toErrorPage(navigate);
                    }
                })
        }
    }

    //Navigate to home, only if login was successful
    const toHome = () => {
        if (appState.table) {
            navigate('/home');
        }
    };

    //Handle user input to change accesscode (when maually inserted)
    const handleCodeChange = (e) => {
        setaccesscode(e.target.value)
    }

    //Set cta variant based on the login state
    const btnVariant = inputInQuery ? (appState.table ? "success" : "secondary") : (accesscode.trim() !== "" ? "success" : "secondary");

    return (
        <>
            {/* Intestazione della pagina */}
            <header className=''>
                <h4 id="table" className='luckiest-font mt-5 bg-white'>
                    Tavolo {appState.table ? appState.table.number : "..."} {/* Mostra il numero del tavolo */}
                </h4>
            </header>

            {/* Sezione del logo */}
            <section id="logo">
                <h1>{name}</h1> {/* Mostra il nome del ristorante */}
                <Logo alt={`Logo ${name}`} /> {/* Mostra il logo con il componente */}
            </section>

            {/* Sezione di call-to-action */}
            <form className='call-to-action' onSubmit={
                inputInQuery ? handleSubmitFactory(toHome) : handleSubmitFactory(tryLog)}>
                {!inputInQuery && //Display input field only if was not provided in query
                    <Input type='text' placeholder='Inserisci il codice' className='cta-input'
                        style={{ maxWidth: "400px", width: "80vw" }}
                        error={error} value={accesscode} onChange={handleCodeChange} />
                }
                <Button
                    variant={btnVariant}
                    size="lg"
                    className='cta-btn'
                    type='submit'>
                    {inputInQuery ? "INIZIA A ORDINARE" : "ACCEDI AL TAVOLO"}
                </Button>
            </form>
            <LoadingPopup loading={loading} />
        </>
    );
}

export default Landing;