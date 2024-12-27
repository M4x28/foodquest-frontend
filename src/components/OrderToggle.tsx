import React, { useState } from 'react';

// OrderToggle
export const OrderToggle: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2 text-white">
            <h5 className="me-3">Vorresti prima gli antipasti?</h5>
            <div className="d-flex align-items-center">
                <h5 className="form-check-label me-2">
                    No
                </h5>
                <div className="form-switch">
                    <input
                        className={`form-check-input ${isChecked ? 'bg-warning' : ''}`}
                        type="checkbox"
                        id="toggleAntipasti"
                        checked={isChecked}
                        onChange={handleToggle}
                    />
                </div>
                <h5 className="form-check-label ms-2">
                    Si
                </h5>
            </div>
        </div>
    );
};