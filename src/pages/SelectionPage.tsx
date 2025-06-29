import React, { useState, useEffect } from "react";
import { Button } from "../components/input/Button.tsx";
import CheckBox from "../components/input/CheckBox.tsx";
import "./SelectionPage.css";
import Header, { Pages } from "../components/utility/Header.tsx";
import { backendServer } from "../App.tsx"; // Backend server per effettuare chiamate API

export interface SelectionItem {
    id: string;
    label: string;
}

export interface SelectionPageProps {
    title: string;
    skipEnabled: boolean;
    onContinue: (selectedIds: string[]) => void;
    onSkip?: () => void;
    minSelected?: number;
    maxSelected?: number;
    items?: SelectionItem[];
}

const SelectionPage: React.FC<SelectionPageProps> = ({
    title,
    skipEnabled,
    onContinue,
    onSkip,
    minSelected = 0,
    maxSelected = Infinity,
    items: itemsProp,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [items, setItems] = useState<SelectionItem[]>(itemsProp || []);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!itemsProp) {
            const fetchCategories = async () => {
                try {
                    // Effettua la chiamata al server per ottenere gli allergeni solo se items non è passato come prop
                    const data = await backendServer.allergen.fetchAllergen();
                    setItems(
                        data.map((a: any) => ({
                            id: a.documentId,
                            label: a.name
                        }))
                    );
                    console.log("Allergeni recuperati:", data); // Log per debug
                } catch (error) {
                    console.error("Errore nel recupero degli allergeni:", error); // Gestione dell'errore
                }
            };

            fetchCategories(); // Richiama la funzione per ottenere gli allergeni
        } else {
            setItems(itemsProp);
        }
    }, [itemsProp]); // Aggiorna se itemsProp cambia

    const toggleSelection = (id: string) => {
        setSelected(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                if (prev.length < maxSelected) {
                    return [...prev, id];
                } else {
                    setError(`Puoi selezionare al massimo ${maxSelected} elementi.`);
                    setTimeout(() => setError(""), 2000);
                    return prev;
                }
            }
        });
    };

    const handleContinue = () => {
        if (selected.length < minSelected) {
            setError(`Seleziona almeno ${minSelected} elemento/i.`);
            setTimeout(() => setError(""), 2000);
            return;
        }
        onContinue(selected);
    };

    return (
        <div className="align-items-center">
            {/* Intestazione della pagina */}
            <Header pageName="BENVENUTO" current={Pages.Home} />

            <div className="selection-page">
                <h1 className="selection-title">{title}</h1>

                <div className="selection-content">
                    {error && (
                        <div className="alert alert-danger text-center" style={{ fontSize: "1rem" }}>{error}</div>
                    )}
                    <div className="selection-list scrollable-list">
                        {items.map(item => (
                            <div key={item.id} className="selection-item">
                                <CheckBox
                                    value={selected.includes(item.id)}
                                    onChange={() => toggleSelection(item.id)}
                                    text={item.label}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="selection-buttons fixed-bottom mx-3">
                    {skipEnabled ? (
                        <Button
                            className="create-btn rounded rounded-4"
                            variant="secondary"
                            onClick={onSkip}
                            style={{ width: "50%" }}
                        >
                            Salta
                        </Button>
                    ) : null}
                    <Button
                        className={`create-btn rounded rounded-4${skipEnabled ? ' mx-3' : ''}`}
                        variant="success"
                        onClick={handleContinue}
                        style={{ width: skipEnabled ? "50%" : "100%" }}
                        disabled={selected.length < minSelected}
                    >
                        Avanti{" "}
                        <span
                            style={{
                                fontSize: "1.5rem",
                                marginLeft: 8
                            }}
                        >
                            &gt;&gt;
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;