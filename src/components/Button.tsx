import React from 'react';
import '../bootstrap.css'; // Importa il file CSS di Bootstrap

export const Button = ({ variant, size, onClick, ...props }) => {
    const sizeClass = size ? `btn-${size}` : '';
    const variantClass = variant ? `btn-${variant}` : 'btn-primary';
    return (
        <button
            className={`btn ${variantClass} ${sizeClass}`}
            type="button"
            onClick={onClick}
            style={{
                fontFamily: "Luckiest Guy, cursive",
                letterSpacing: "0.1rem",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
            }}
            {...props}
        >
        </button>
    );
};