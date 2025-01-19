import React, { useContext, useEffect, useState } from 'react';
import {AppStateCtx, backendServer} from "../App.tsx"

import mario from "../assets/Home/mario.png";
import pizza from '../assets/Home/pizza.png';

import "./page.css";
import "./landing.css";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/input/Button.tsx';
import { toErrorPage } from '../utility/generic.ts';

function Landing() {

    const [appState,updateAppState] = useContext(AppStateCtx);
    const { accessCode } = useParams();

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [name,setName] = useState("Pizzeria da Mimmo");
    // eslint-disable-next-line
    const [logoUrl,setLogoUrl] = useState(pizza);

    useEffect(() => {
        if(accessCode)
            backendServer.table.logToTable(accessCode)
            .then(table => {
                table.accessCode = accessCode;
                updateAppState("table",table);
            })
            .catch(e => {
                console.log(e)
                toErrorPage(navigate);
            })
    },[accessCode]);

    const toHome = () => {
        if(appState.table)
            navigate('/home')
    }

    return (
        <>
            <header className='page-box-bg'>
                <h4 id="table" className='luckiest-font'> Tavolo {appState.table ? appState.table.number : ""}</h4>
                <div id='welcome-msg'>
                    <img src={mario} alt='Mascotte foodquest'/>
                    <h3>Foodquest ti da il benvenuto da</h3>
                </div>
            </header>
            <section id="logo">
                <img src={logoUrl} alt={"Logo " + name}/>
                <h1>{name}</h1>
            </section>
            <Button
                variant={appState.table ? "success" : "secondary"}
                size="lg"
                className='call-to-action'
                onClick={toHome}>
                        INIZIA A ORDINARE
            </Button>               
        </>
    );
}

export default Landing;