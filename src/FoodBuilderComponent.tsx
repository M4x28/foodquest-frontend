import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Ingredient {
    uuid: string;
    nome: string;
    imgDir: string;
}

interface FoodIngredient extends Ingredient {
    inCottura: boolean; // true = durante la cottura, false = dopo la cottura
    quantity: number;   // Numero di volte che l'ingrediente è stato aggiunto
}

interface Food {
    base: Ingredient;
    slices?: 4 | 5 | 6; // Default: 4 per Pizza
    ingredients: FoodIngredient[];
}

// Data
const ingredienti: Ingredient[] = [
    { uuid: uuidv4(), nome: 'Cheese', imgDir: '/images/cheese.png' },
    { uuid: uuidv4(), nome: 'Tomato', imgDir: '/images/tomato.png' },
    { uuid: uuidv4(), nome: 'Bacon', imgDir: '/images/bacon.png' },
    { uuid: uuidv4(), nome: 'Mushrooms', imgDir: '/images/mushrooms.png' },
    { uuid: uuidv4(), nome: 'Peppers', imgDir: '/images/peppers.png' },
];

const toppings: Ingredient[] = [
    { uuid: uuidv4(), nome: 'Ketchup', imgDir: '/images/ketchup.png' },
    { uuid: uuidv4(), nome: 'Mayo', imgDir: '/images/mayo.png' },
    { uuid: uuidv4(), nome: 'BBQ Sauce', imgDir: '/images/bbq_sauce.png' },
];

const basi: Ingredient[] = [
    { uuid: uuidv4(), nome: 'Pizza', imgDir: '/images/pizza.png' },
    { uuid: uuidv4(), nome: 'Burger', imgDir: '/images/burger.png' },
    { uuid: uuidv4(), nome: 'Pasta', imgDir: '/images/pasta.png' },
];

// Component
const FoodBuilderComponent: React.FC = () => {
    const [food, setFood] = useState<Food>({
        base: basi[0], // Default: Pizza
        slices: 4,
        ingredients: [],
    });

    const updateBase = (base: Ingredient) => {
        setFood((prevFood) => ({
            ...prevFood,
            base,
            slices: base.nome === 'Pizza' ? 4 : undefined, // Imposta 4 fette di default solo per Pizza
        }));
    };

    const updateSlices = (slices: 4 | 5 | 6) => {
        setFood((prevFood) => ({ ...prevFood, slices }));
    };

    const handleIngredient = (ingredient: Ingredient, action: 'add' | 'remove' | 'toggleCooking') => {
        setFood((prevFood) => {
            const existingIngredientIndex = prevFood.ingredients.findIndex(
                (ing) => ing.uuid === ingredient.uuid
            );
            const ingredients = [...prevFood.ingredients];

            if (action === 'add') {
                if (existingIngredientIndex >= 0) {
                    const existingIngredient = ingredients[existingIngredientIndex];
                    if (existingIngredient.quantity < 3) {
                        existingIngredient.quantity++;
                    }
                } else {
                    ingredients.push({ ...ingredient, inCottura: false, quantity: 1 });
                }
            }

            if (action === 'remove') {
                if (existingIngredientIndex >= 0) {
                    const existingIngredient = ingredients[existingIngredientIndex];
                    if (existingIngredient.quantity > 1) {
                        existingIngredient.quantity--;
                    } else {
                        ingredients.splice(existingIngredientIndex, 1);
                    }
                }
            }

            if (action === 'toggleCooking') {
                
                if (existingIngredientIndex !== 0) {
                    console.log('qui');
                    const existingIngredient = ingredients[existingIngredientIndex];
                    existingIngredient.inCottura = !existingIngredient.inCottura;
                }
            }

            return { ...prevFood, ingredients };
        });
    };

    return (
        <div>
            <h1>Food Builder</h1>

            {/* Base Selection */}
            <div>
                <h2>Select Base</h2>
                {basi.map((base) => (
                    <button
                        key={base.uuid}
                        onClick={() => updateBase(base)}
                        style={{
                            backgroundColor: food.base.uuid === base.uuid ? 'lightgreen' : 'white',
                        }}
                    >
                        {base.nome}
                    </button>
                ))}
            </div>

            {/* Slices Selection (if applicable) */}
            {food.base.nome === 'Pizza' && (
                <div>
                    <h2>Select Number of Slices</h2>
                    {[4, 5, 6].map((slice) => (
                        <button
                            key={slice}
                            onClick={() => updateSlices(slice as 4 | 5 | 6)}
                            style={{
                                backgroundColor: food.slices === slice ? 'lightgreen' : 'white',
                            }}
                        >
                            {slice} Slices
                        </button>
                    ))}
                </div>
            )}

            {/* Ingredients */}
            <div>
                <h2>Manage Ingredients</h2>
                {ingredienti.map((ingredient) => {
                    const existingIngredient = food.ingredients.find((ing) => ing.uuid === ingredient.uuid);
                    return (
                        <div key={ingredient.uuid} style={{ marginBottom: '10px' }}>
                            <img src={ingredient.imgDir} alt={ingredient.nome} width="50" style={{ marginRight: '10px' }} />
                            <strong>{ingredient.nome}</strong>
                            <button onClick={() => handleIngredient(ingredient, 'add')}>+</button>
                            <button onClick={() => handleIngredient(ingredient, 'remove')}>-</button>
                            {existingIngredient && (
                                <button onClick={() => handleIngredient(ingredient, 'toggleCooking')}>
                                    {existingIngredient.inCottura ? 'Switch to Post-Cooked' : 'Switch to Cooked'}
                                </button>
                            )}
                            <span style={{ marginLeft: '10px' }}>
                                Quantity: {existingIngredient ? existingIngredient.quantity : 0}{' '}
                                {existingIngredient ? (existingIngredient.inCottura ? '(Cooked)' : '(Post-Cooked)') : ''}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Toppings */}
            <div>
                <h2>Manage Toppings</h2>
                {toppings.map((topping) => {
                    const existingTopping = food.ingredients.find((ing) => ing.uuid === topping.uuid);
                    return (
                        <div key={topping.uuid} style={{ marginBottom: '10px' }}>
                            <img src={topping.imgDir} alt={topping.nome} width="50" style={{ marginRight: '10px' }} />
                            <strong>{topping.nome}</strong>
                            <button onClick={() => handleIngredient(topping, 'add')}>+</button>
                            <button onClick={() => handleIngredient(topping, 'remove')}>-</button>
                            {existingTopping && (
                                <button onClick={() => handleIngredient(topping, 'toggleCooking')}>
                                    {existingTopping.inCottura ? 'Switch to Post-Cooked' : 'Switch to Cooked'}
                                </button>
                            )}
                            <span style={{ marginLeft: '10px' }}>
                                Quantity: {existingTopping ? existingTopping.quantity : 0}{' '}
                                {existingTopping ? (existingTopping.inCottura ? '(Cooked)' : '(Post-Cooked)') : ''}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Preview */}
            <div>
                <h2>Preview Your Food</h2>
                <p><strong>Base:</strong> {food.base.nome}</p>
                {food.slices && <p><strong>Slices:</strong> {food.slices}</p>}
                <p><strong>Ingredients:</strong></p>
                <ul>
                    {food.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.nome} x{ingredient.quantity} ({ingredient.inCottura ? 'Cooked' : 'Post-Cooked'})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FoodBuilderComponent;
