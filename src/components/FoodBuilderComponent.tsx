import React, { useState } from 'react';
import { DropdownButton, DropdownItem } from './Dropdown.tsx';
import { Button } from './Button.tsx';

const FoodBuilderComponent = () => {
    const [basePrice, setBasePrice] = useState(2); // Prezzo base
    const [ingredients, setIngredients] = useState([
        { name: 'Cipolla', price: 1.5, count: 0, image: 'cipolla.png' },
        { name: 'Mozzarella', price: 1, count: 0, image: 'mozzarella.png' },
        { name: 'Salsa', price: 1, count: 0, image: 'salsa.png' },
    ]);
    const [slices, setSlices] = useState(4); // Taglio di default
    const [selectedBase, setSelectedBase] = useState('Impasto Classico');

    const handleIngredientChange = (index, increment) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index].count += increment;
        if (updatedIngredients[index].count < 0) updatedIngredients[index].count = 0;
        setIngredients(updatedIngredients);
    };

    const handleSliceChange = (increment) => {
        const newSlices = slices + increment;
        if (newSlices >= 4 && newSlices <= 6) {
            setSlices(newSlices);
        }
    };

    const handleBaseChange = (base, price) => {
        setSelectedBase(base);
        setBasePrice(price);
    };

    const totalPrice = basePrice + ingredients.reduce((sum, ing) => sum + ing.price * ing.count, 0);

    return (
        <div className="pizza-builder-container">
            <div className="pizza-preview">
                {/* Immagine dinamica della pizza */}
                <div className="pizza-image" style={{ position: 'relative', width: '500px', height: '500px' }}>
                    {ingredients.map((ingredient, index) => (
                        ingredient.count > 0 && (
                            <img
                                key={index}
                                src={`/images/${ingredient.image}`}
                                alt={ingredient.name}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        )
                    ))}
                </div>
            </div>

            <DropdownButton id="dropdown-basic-button" title={selectedBase}>
                <DropdownItem onClick={() => handleBaseChange('Impasto Classico', 2)}>
                    Impasto Classico 2€
                </DropdownItem>
                <DropdownItem onClick={() => handleBaseChange('Impasto Integrale', 2.5)}>
                    Impasto Integrale 2.5€
                </DropdownItem>
                <DropdownItem onClick={() => handleBaseChange('Impasto Senza Glutine', 3)}>
                    Impasto Senza Glutine 3€
                </DropdownItem>
            </DropdownButton>

            <div className="ingredient-list">
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item d-flex justify-content-between align-items-center">
                        <span>{ingredient.name} {ingredient.price}€</span>
                        <div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleIngredientChange(index, -1)}
                            >
                                -
                            </Button>
                            <span className="mx-2">{ingredient.count}</span>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleIngredientChange(index, 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="slices-controller mt-3">
                <span>Tagliata in {slices}</span>
                <>
                    <Button variant="outline-secondary" size="" onClick={() => handleSliceChange(-1)}>-</Button>
                    <Button variant="outline-secondary" size="" onClick={() => handleSliceChange(1)}>+</Button>
                </>
            </div>

            <div className="total-price mt-3">
                Prezzo Totale: {totalPrice.toFixed(2)}€
            </div>

            <div className="actions mt-4 d-flex justify-content-between">
                <Button variant="primary" size="lg" onClick={() => alert('Apri popup per aggiungere ingredienti!')}>
                    Aggiungi Ingrediente +
                </Button>
                <Button variant="success" size="lg" onClick={() => alert('Pizza confermata!')}>
                    Conferma
                </Button>
            </div>
        </div>
    );
};

export default FoodBuilderComponent;