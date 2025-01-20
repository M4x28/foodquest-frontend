import React, { useContext, useState } from "react";
import AnimatedButton from "../input/AnimatedButton.tsx"; // Pulsante con animazione
import { Link, useNavigate } from "react-router-dom"; // Hook per navigazione e link

// Import delle immagini e icone
import placeholder from "../../assets/pizzaPlacehoder.webp";
import { ReactComponent as DownIcon } from "../../assets/down.svg";
import { ReactComponent as UpIcon } from "../../assets/up.svg";
import { ReactComponent as CartIcon } from "../../assets/shoppingCart.svg";
import { ReactComponent as TicIcon } from "../../assets/tic.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";

import "./productCard.css"; // Stile della scheda prodotto
import { AppStateCtx } from "../../App.tsx"; // Contesto globale dell'applicazione
import { formatPrice, toErrorPage } from "../../utility/generic.ts"; // Utilità generiche
import CollapseElement from "../utility/CollapseElement.tsx"; // Componente per la gestione delle sezioni a scomparsa
import { Allergen, Ingredient, Product } from "../../server/server.ts"; // Tipi e interfacce per i dati
import { backendServer } from '../../App.tsx'; // Connettore del backend

// Interfaccia per le proprietà del componente
interface PropType {
    product: Product; // Informazioni sul prodotto
    editable?: boolean; // Flag per abilitare la modifica del prodotto
    imgUrl?: string; // URL immagine del prodotto
    ingredients?: Ingredient[]; // Lista degli ingredienti
    allergens?: Allergen[]; // Lista degli allergeni
    setErr?: Function; // Funzione opzionale per gestire errori
}

/**
 * Componente per rappresentare una scheda prodotto.
 * 
 * @param {Product} product - Dati del prodotto.
 * @param {Ingredient[]} [ingredients] - Lista degli ingredienti.
 * @param {Allergen[]} [allergens] - Lista degli allergeni.
 * @param {boolean} [editable] - Abilita la modifica del prodotto.
 * @param {string} [imgUrl] - URL immagine del prodotto (default: placeholder).
 * @param {Function} [setErr] - Funzione per gestire errori.
 */
function ProductCard({ product, ingredients, allergens, editable, imgUrl = placeholder, setErr }: PropType) {
    const navigate = useNavigate(); // Hook per la navigazione
    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx); // Recupera lo stato globale
    const [showAllergen, setShowAllergen] = useState(false); // Stato per mostrare/nascondere gli allergeni

    // Descrizione generata dagli ingredienti
    let description = "";
    if (ingredients) {
        description = ingredients
            .sort((a, b) => -a.type.localeCompare(b.type)) // Ordina gli ingredienti per tipo
            .reduce((desc, ig) => desc + ig.name + ", ", ""); // Crea una stringa con i nomi degli ingredienti
    }

    /**
     * Alterna la visibilità della sezione allergeni.
     */
    function toggleAllergen() {
        setShowAllergen(s => !s);
    }

    /**
     * Aggiunge il prodotto al carrello.
     */
    function buyItem() {
        backendServer.products.addProductToCart(
            appState.table,
            product.documentId,
            appState.user ? appState.user.user.documentId : undefined // Aggiunge l'utente se presente
        ).then(() => {
            console.log(product.name, "Acquistata"); // Conferma di acquisto
        }).catch((err) => {
            toErrorPage(navigate); // Reindirizza alla pagina di errore in caso di errore
            console.log("Error:\n", err); // Logga l'errore
        });
    }

    return (
        <div className="my-card"> {/* Contenitore principale della scheda prodotto */}
            {/* Intestazione del prodotto */}
            <div className="product-header">
                <img src={imgUrl} alt="Foto del prodotto" /> {/* Immagine del prodotto */}
                <h3 className="product-name luckiest-font">{product.name}</h3> {/* Nome del prodotto */}
                <h3 className="product-price">{formatPrice(product.price)} €</h3> {/* Prezzo del prodotto */}
            </div>

            {/* Descrizione del prodotto */}
            {description && <p className="product-description">{description}</p>}

            {/* Pulsanti associati al prodotto */}
            <div className="product-buttons">
                {/* Pulsante per mostrare/nascondere gli allergeni */}
                <button className="allergen-btn" onClick={toggleAllergen}>
                    {showAllergen ? <DownIcon /> : <UpIcon />} Allergeni
                </button>

                {/* Pulsante per acquistare il prodotto */}
                <AnimatedButton
                    className={editable ? "buy-btn" : "buy-btn double-col-size"}
                    animationClass="buy-anim"
                    OnClick={buyItem}
                >
                    <CartIcon className="cart-icon" />
                    <TicIcon className="tic-icon" />
                </AnimatedButton>

                {/* Pulsante per modificare il prodotto (se abilitato) */}
                {editable && (
                    <Link className="edit-btn" to={"/creazionepizza/".concat(product.documentId)}>
                        <EditIcon /> Modifica
                    </Link>
                )}
            </div>

            {/* Sezione a scomparsa per gli allergeni */}
            <CollapseElement open={showAllergen} className="product-allergen">
                {allergens && allergens?.length > 0 ? (
                    <ul>
                        {allergens.map(a => (
                            <li key={a.documentId}>{a.name}</li> // Elenco degli allergeni
                        ))}
                    </ul>
                ) : (
                    <p>Nessun allergene comune presente</p> // Messaggio in caso di assenza di allergeni
                )}
            </CollapseElement>
        </div>
    );
}

export default ProductCard;