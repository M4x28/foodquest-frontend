import React from "react";
import "../../bootstrap.css"; // Stile di Bootstrap
import "./pointCard.css"; // Stile personalizzato

interface BoxPuntiProps {
    username: string;
    points: number;
}

const BoxPunti: React.FC<BoxPuntiProps> = ({ username, points }) => {
    return (
        <div className="text-center central-div">
            {/* Contenitore centrale */}
            <h2 className="welcome-text">Ciao {username}</h2>
            {/* Testo di benvenuto */}
            <div className="points-container">
                {/* Contenitore per i punti */}
                <h4 className="points">
                    Hai <span style={{ color: "var(--dark-col)" }}><b>{points} punti</b></span>
                </h4>
                <p className="points-description">
                    Ottieni punti acquistando da noi e poi convertili in sconti esclusivi
                </p>
            </div>
        </div>
    );
};

export default BoxPunti;
