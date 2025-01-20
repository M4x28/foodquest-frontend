import React, { useContext, useEffect, useState } from 'react';
import {AppStateCtx, backendServer} from "../App.tsx"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/input/Button.tsx';
import { toErrorPage } from '../utility/generic.ts';
import Input from '../components/input/Input.tsx';

import mario from "../assets/Home/mario.png";
import bigMario from "../assets/Home/big-mario.png";
import pizza from '../assets/Home/pizza.png';

import "./page.css";
import "./landing.css";


function Landing() {

    const [appState,updateAppState] = useContext(AppStateCtx);
    const [param,_] = useSearchParams();

    const inputInQuery = param.has("accessCode");

    const [accessCode,setAccessCode] = useState<string>(param.get("accessCode") || "");
    const [error,setError] = useState<string|undefined>();

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [name,setName] = useState("Pizzeria da Mimmo");
    // eslint-disable-next-line
    const [logoUrl,setLogoUrl] = useState(pizza);

    const accessTable = () => {
        return backendServer.table.logToTable(accessCode)
        .then(table => {
            table.accessCode = accessCode;
            updateAppState("table",table);
        })
    }

    useEffect(() => {
        if(inputInQuery)
            accessTable()
            .catch(e => {
                console.log(e)
                toErrorPage(navigate);
            })
    },[]);

    const tryLog = () => {
        const trimCode = accessCode.trim();
        if(trimCode != ""){
            accessTable()
            .then(() => {
                navigate('/home')
            })
            .catch((e) => {
                console.log(e);
                setError("Il codice inserito non è valido");
            })
        }
    }

    const toHome = () => {
        if(appState.table)
            navigate('/home')
    }

    const handleCodeChange = (e) => {
        setAccessCode(e.target.value)
    }

    const btnVariant = inputInQuery ? (appState.table ? "success" : "secondary") : (accessCode.trim() !== "" ? "success" : "secondary");

    return (
        <>
            <header className='page-box-bg'>
                <h4 id="table" className='luckiest-font'> Tavolo {appState.table ? appState.table.number : "..."}</h4>
                <div id='welcome-msg'>
                    <picture>
                        <source media='(min-width: 500px)' srcSet={bigMario}></source>;
                        <source media="(max-width: 499px)" srcSet={mario}></source>
                        <img src={mario} alt='Mascotte foodquest'></img>
                    </picture>
                    <h3>Foodquest ti da il benvenuto da</h3>
                </div>
            </header>
            <section id="logo">
                <img src={logoUrl} alt={"Logo " + name}/>
                <h1>{name}</h1>
            </section>
            <section className='call-to-action'>
            {!inputInQuery && 
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