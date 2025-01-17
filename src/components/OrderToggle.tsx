import React, { useState } from 'react';
import '../bootstrap.css';
import './OrderToggle.css';

interface PropType {
    children: React.ReactNode;
}

// OrderToggle
export const OrderToggle: React.FC<PropType> = ({ children }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="d-flex align-items-center mt-4 mb-2 text-white">
            <div className="me-3">
                <input
                    className="custom-checkbox"
                    type="checkbox"
                    id="toggleAntipasti"
                    checked={isChecked}
                    onChange={handleToggle}
                />
            </div>
            <h5 className="custom-text">{children}</h5>
        </div>
    );
};
