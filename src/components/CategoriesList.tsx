import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button.tsx";
import { getCategoriesIdAndName } from "../services/categoryService.ts";

interface Category {
    id: string;
    documentId: string;
    name: string;
}

const CategoriesList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesIdAndName();
                setCategories(data);
            } catch (error) {
                console.error("Errore nel recupero delle categorie:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center px-3"
            style={{
                maxWidth: "400px", // Aumentata la larghezza massima del contenitore
                width: "80%", // Larghezza dinamica per dispositivi più piccoli
            }}
            
        >
            {categories.map((category) => (
                <Link
                    to={`/products/${category.documentId}`}
                    key={category.documentId}
                    className="text-decoration-none w-100"
                >
                    <Button
                        variant="light text-dark fw-bold text-LG"
                        size="lg"
                        style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: "10px",
                            fontSize: "1.2rem",
                            border: "2px solid #ccc",
                            margin: "10px 0",
                        }}
                    >
                        {category.name}
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesList;
