import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateCtx, backendServer } from "./App.tsx";
import useRefresh from "./utility/useRefresh.ts";
import Header, { Pages } from "./components/utility/Header.tsx";
import CheckBox from "./components/input/CheckBox.tsx";
import ButtonWithPrompt from "./components/popup/ButtonWithPrompt.tsx";
import { toErrorPage } from "./utility/generic.ts";
import useLoading from "./utility/useLoading.ts";
import LoadingPopup from "./components/popup/LoadingPopup.tsx";

const sec = (time:number) => {
    return new Promise<void>((resolve,reject) => {
        setTimeout(resolve,time * 1000);
    })
}

//Test per vedere se funzionava
function Test() {

    const [load,start,end] = useLoading(500,false);

    const loadStuff = () => {
        start();
        sec(10)
        .then(() => {
            console.log("loaded");
            end();
        }
        );
    };

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [state, setState] = useContext(AppStateCtx);

    const [time, refreshTime] = useRefresh<Date>(async () => new Date(), new Date(), 1000);
    const [check, setCheck] = useState(false);

    const pad0 = (n: number, lenght: number): string => {
        let res: string = n.toString();
        return res.padStart(lenght, "0");
    }

    const formatDate = (date: Date): string => {

        const hours = pad0(date.getHours(), 2);
        const mins = pad0(date.getMinutes(), 2);
        const secs = pad0(date.getSeconds(), 2);

        return hours + ":" + mins + ":" + secs;

    }

    const test = () => { alert("Ciao sono una azione irreversibile") }

    return (
        <div className='page'>
            <Header pageName='Test' current={Pages.FC} />
            <h1>{formatDate(time)}</h1>

            <CheckBox text='Ciao' value={check} onChange={(e) => {
                console.log("click")
                backendServer.orders.fetchCurrentOrder({ accessCode: "abcd", sessionCode: "3", number: 3 })
                .then((res) => console.log(res));
                setCheck(c => !c)
            }} />

            <button className="light-btn btn" onClick={refreshTime}> Che ore sono? </button>

            <ButtonWithPrompt className="my-btn" onClick={test} popupTitle='Azione Irreversibile'
                popupText='Questa azione non può essere annullata, proseguire?'>
                <p style={{ margin: "0px" }}> Test Irreversibile </p>
            </ButtonWithPrompt>

            <button className='dark-btn-inverse my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "3", number:3 })}>
                Log to table
            </button>
            <button className='err-btn my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "4" })}>
                Log to expired table
            </button>

            <button className='err-btn my-btn' onClick={() => toErrorPage(navigate)}>
                Error
            </button>

            <button className='err-btn my-btn' onClick={() => loadStuff()}>
                Load Stuff
            </button>

            <LoadingPopup loading={load}></LoadingPopup>
        </div>
    )
}

export default Test;