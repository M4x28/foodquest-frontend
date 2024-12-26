import React from 'react';
import '../bootstrap.css'; // Importa il file CSS di Bootstrap
import { Button } from './Button.tsx';

export const DropdownButton = ({ id, title, children }) => {
    return (
        <div className="dropdown">
            <Button
                variant="secondary"
                size=""
                onClick={() => { }}
                id={id}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {title}
            </Button>
            <ul className="dropdown-menu" aria-labelledby={id}>
                {children}
            </ul>
        </div>
    );
};

export const Dropdown = ({ children }) => {
    return (
        <ul className="dropdown-menu">
            {children}
        </ul>
    );
};

export const DropdownItem = ({ onClick, children }) => {
    return (
        <li>
            <button
                className="dropdown-item"
                type="button"
                onClick={onClick}
            >
                {children}
            </button>
        </li>
    );
};