import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./input/Button.tsx";
import { backendServer } from "../App.tsx";
import { Category } from "../server/server.ts";
import './CategoryList.css'; // Importa il file degli stili


const CategoriesList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await backendServer.categories.fetchCategoriesIdAndName();
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
                        variant="light text-dark fw-bold text-LG button-list"
                        size="lg"

                    >
                        {category.name}
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesList;
