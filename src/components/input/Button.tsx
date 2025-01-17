import React from 'react';
import '../../bootstrap.css'; // Importa il file CSS di Bootstrap

interface ButtonProps {
    variant?: string;
    size?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any; // Per gestire altre proprietà dinamiche
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'success',
    size,
    onClick,
    className = '',
    children,
    ...props
}) => {
    const sizeClass = size ? `btn-${size}` : '';
    const variantClass = variant ? `btn-${variant}` : 'btn-success';
    return (
        <button
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            type="button"
            onClick={onClick}
            style={{
                fontFamily: "Luckiest Guy, cursive",
                letterSpacing: "0.1rem",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            {...props}
        >
            {children}
        </button>
    );
};
