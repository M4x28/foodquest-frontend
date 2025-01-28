import React, { useContext, useEffect, useState } from 'react'; // Importa React e i suoi hook principali
import { useNavigate } from 'react-router-dom'; // Hook per la navigazione tra pagine
import { AppStateCtx, backendServer } from '../App.tsx'; // Importa il contesto dell'app e il server backend
import { ReactComponent as ConfirmIcon } from "../assets/confirm.svg"; // Importa un'icona SVG per la conferma
import '../bootstrap.css'; // Importa gli stili di Bootstrap
import CheckBox from '../components/input/CheckBox.tsx'; // Importa un componente per la checkbox
import { OrderCategoryComponent } from '../components/OrderItemComponent.tsx'; // Importa il componente per mostrare gli elementi dell'ordine
import ButtonWithPrompt from '../components/popup/ButtonWithPrompt.tsx'; // Importa un pulsante con popup di conferma
import Header, { Pages } from "../components/utility/Header.tsx"; // Importa il componente Header e l'oggetto Pages
import { countProduct } from '../utility/generic.ts'; // Importa una funzione per contare i prodotti

// Componente principale per la pagina dell'ordine
const OrderPage: React.FC = () => {
    const navigate = useNavigate(); // Hook per la navigazione
    const [appState] = useContext(AppStateCtx); // Usa il contesto globale per accedere allo stato dell'app

    const [orderDocumentId, setOrderDocumentId] = useState<string | null>(null); // Stato per memorizzare l'ID dell'ordine
    const [itemsByCategory, setItemsByCategory] = useState({}); // Stato per memorizzare gli elementi raggruppati per categoria
    const [antFirst, setAntFirst] = useState(false); // Stato per controllare l'ordinamento (antipasti per primi)

    useEffect(() => {
        // Richiama immediatamente i dati dell'ordine al primo avvio
        fetchOrderData();

        // Definisce l'intervallo per richiamare la funzione fetchOrderData ogni 5 secondi
        const intervalId = setInterval(() => {
            fetchOrderData(); // Richiama i dati dell'ordine
        }, 5000);

        // Cancella l'intervallo quando il componente viene smontato o cambia la tabella
        return () => clearInterval(intervalId);
    }, [appState.table]); // Dipendenza per cambiare il comportamento quando cambia la tabella


    // Funzione per ottenere i dati dell'ordine dal server
    const fetchOrderData = async () => {
        try {
            const order = await backendServer.orders.fetchCurrentOrder(appState.table); // Ottieni l'ordine corrente per la tabella
            if (order) {
                setOrderDocumentId(order.documentId); // Salva l'ID dell'ordine
                await organizeItems(order.products); // Organizza i prodotti per categoria
            }
        } catch (err) {
            console.error('Error fetching order:', err); // Logga l'errore
            navigate('/error'); // Reindirizza a una pagina di errore
        }
    };

    // Funzione per organizzare i prodotti in categorie
    const organizeItems = async (items) => {
        const itemsMap = {}; // Mappa per organizzare gli elementi per categoria

        const countedItems = countProduct(items); // Conta le quantità dei prodotti

        for (const item of countedItems) {
            const categoryId = item.category.documentId; // Ottieni l'ID della categoria
            if (categoryId) {
                if (!itemsMap[categoryId]) {
                    itemsMap[categoryId] = {
                        name: item.category.name, // Nome della categoria
                        items: [] // Lista di elementi della categoria
                    };
                }

                if (item.name === 'Custom') {
                    console.log(item);
                    const ingredients = await fetchIngredientsInternal(item.documentId); // Ottieni gli ingredienti
                    item.ingredientsId = ingredients.map(ingredient => ingredient.documentId); // Aggiungi gli ID degli ingredienti
                }

                itemsMap[categoryId].items.push(item); // Aggiungi l'elemento alla categoria
            }
        }

        // Ordina le categorie in base a `antFirst`
        const sortedItemsMap = {};
        if (antFirst) {
            Object.keys(itemsMap).sort((a, b) => itemsMap[a].name === 'Antipasti' ? 1 : itemsMap[b].name === 'Antipasti' ? -1 : 0)
                .forEach(key => {
                    sortedItemsMap[key] = itemsMap[key];
                });
        } else {
            Object.keys(itemsMap).sort((a, b) => itemsMap[a].name === 'Antipasti' ? -1 : itemsMap[b].name === 'Antipasti' ? 1 : 0)
                .forEach(key => {
                    sortedItemsMap[key] = itemsMap[key];
                });
        }

        setItemsByCategory(sortedItemsMap); // Aggiorna lo stato con gli elementi organizzati
    };

    // Funzione per ottenere gli ingredienti di un prodotto
    const fetchIngredientsInternal = async (productId) => {
        try {
            const response = await backendServer.products.getProductIngredients(productId); // Ottieni gli ingredienti dal server
            return response || []; // Ritorna gli ingredienti o una lista vuota se non ci sono
        } catch (error) {
            console.error('Failed to fetch ingredients for product:', productId, error); // Logga l'errore
            return []; // Ritorna una lista vuota in caso di errore
        }
    };

    // Funzione per invertire l'ordine degli antipasti
    const toggleAnt = () => setAntFirst(!antFirst);

    return (
        <>
            <Header pageName="Ordine" current={Pages.Order} /> {/* Header della pagina con il titolo "Ordine" */}
            <div className="p-4" style={{ marginTop: '80px' }}> {/* Contenitore principale con padding e margine */}
                <div style={{ overflowY: 'scroll', paddingBottom: '150px', maxWidth: '500px', margin: '0 auto' }}> {/* Contenitore scrollabile per gli elementi centrato */}
                    {Object.keys(itemsByCategory).length === 0 ? (
                        <div className='text-center text-LG mt-5 pt-5'>
                            <h1>Il carrello è vuoto.</h1>
                        </div>
                    ) : (
                        Object.keys(itemsByCategory)
                            .sort((a, b) => antFirst ? b.localeCompare(a) : a.localeCompare(b)) // Ordina le categorie in base a `antFirst`
                            .map(categoryId => {
                                const category = itemsByCategory[categoryId]; // Ottieni la categoria corrente
                                return category.items.length > 0 && ( // Mostra solo le categorie con elementi
                                    <OrderCategoryComponent
                                        key={categoryId}
                                        title={category.name}
                                        items={category.items}
                                        orderID={orderDocumentId || ''}
                                    /> // Componente per mostrare gli elementi della categoria
                                );
                            })
                    )}
                </div>

                <div style={{
                    position: 'fixed', bottom: 0, width: '90%'
                }}> {/* Contenitore fisso in basso per il checkbox e il pulsante */}
                    <CheckBox value={antFirst} text="Prima gli antipasti." onChange={toggleAnt} /> {/* Checkbox per invertire l'ordine */}
                    <ButtonWithPrompt
                        className='dark-btn check-btn'
                        variant="success w-100"
                        size="lg"
                        popupTitle="Conferma l'Ordine"
                        confirmText="Conferma"
                        confirmClass='err-btn confirm-btn'
                        confirmSvg={<ConfirmIcon />}
                        onClick={() => {
                            backendServer.orders.confirmOrder(orderDocumentId, antFirst); // Conferma l'ordine
                            navigate('/conto'); // Reindirizza alla pagina del conto
                        }}>
                        Conferma Ordine {/* Testo del pulsante */}
                    </ButtonWithPrompt>
                </div>
            </div>
        </>
    );
};

export default OrderPage; // Esporta il componente per l'uso in altre parti dell'app
