import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ProvaPage: React.FC = () => {

    const [prova, setProva] = useState<string | undefined>();

    useEffect(() => {
        const axiosinstance = axios.create({
            // URL base per tutte le richieste API
            baseURL: process.env.API_BASE_URL,
            // Headers di default per tutte le richieste
            headers: {
                "Content-Type": "application/json",
                // Usa il token di autenticazione dall'ambiente
                Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
            },
            // Timeout di default per le richieste
            timeout: 10000,
        });
        const fetchData = async () => {
            try {
                const response = await axiosinstance.get('http://localhost:1337/api/tests');
                console.log(response.data); // Mostra la risposta per debugging
                const provaData = response.data.data?.[0]?.Prova;
                setProva(provaData || 'No data available');
            } catch (error) {
                console.error('Error fetching data:', error);
                setProva('Error fetching data');
            }
        };



        fetchData();
    }, []);


    return (
        <div>
            <p>{prova}</p>
        </div>
    );
};

export default ProvaPage;
