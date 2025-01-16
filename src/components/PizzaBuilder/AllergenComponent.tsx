import React from "react";
import "../../bootstrap.css";

export interface Allergen {
    documentId: string;
    name: string;
    icon: string;
}

const AllergenComponent: React.FC<Allergen> = ({ documentId, name, icon }) => {
    return (
        <div className="d-flex align-items-center">
            <img src={icon} alt={name} style={{ width: "20px", height: "20px" }} className="me-2" />
            <span>{name}</span>
        </div>
    );
};
export default AllergenComponent;