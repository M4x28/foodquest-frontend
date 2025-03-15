import React from "react";
import "../../bootstrap.css"; // Importa gli stili Bootstrap
import { Button } from "./Button.tsx"; // Importa il componente Button

interface ToggleButtonsProps {
    primaryButton: "login" | "register"; // Determina quale bottone è prioritario
    onLogin: () => void; // Funzione per l'azione di login
    onRegister: () => void; // Funzione per l'azione di registrazione
    navigateTo: (path: string) => void; // Funzione per la navigazione
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({
    primaryButton,
    onLogin,
    onRegister,
    navigateTo,
}) => {
    return (
        <div className="button-container">
            {/* Contenitore pulsanti, login-registrazione.css(button-container) */}

            {/* Bottone principale */}
            {primaryButton === "login" ? (
                <>
                    <Button
                        type="submit"
                        variant="success w-100"
                        className="action-button mb-2"
                        size="lg"
                        style={{ backgroundColor: "var(--dark-col)", color: "#fff" }}
                        onClick={onLogin} // Azione login
                    >
                        ACCEDI
                    </Button>
                    {/* Testo separatore, login-registrazione.css(separator-text) */}
                    <Button
                        type="button"
                        variant="light w-100"
                        className="action-button"
                        size="lg"
                        style={{ backgroundColor: "#f6f6f6", color: "var(--very-dark-col)" }}
                        onClick={() => navigateTo("/register")}
                    // Azione: naviga alla pagina registrazione
                    >
                        REGISTRAZIONE
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        type="submit"
                        variant="success w-100"
                        className="action-button mb-2"
                        size="lg"
                        style={{ backgroundColor: "var(--dark-col)", color: "#fff" }}
                        onClick={onRegister} // Azione registrazione
                    >
                        REGISTRAZIONE
                    </Button>
                    {/* Testo separatore, login-registrazione.css(separator-text) */}
                    <Button
                        type="button"
                        variant="light w-100"
                        className="action-button"
                        size="lg"
                        style={{ backgroundColor: "#f6f6f6", color: "var(--very-dark-col)" }}
                        onClick={() => navigateTo("/login")}
                    // Azione: naviga alla pagina login
                    >
                        ACCEDI
                    </Button>
                </>
            )}
        </div>
    );
};

export default ToggleButtons;
