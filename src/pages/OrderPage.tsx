import React, { useContext, useEffect, useState } from 'react';
import '../bootstrap.css';
import Header, { Pages } from "../components/utility/Header.tsx";
import { OrderCategoryComponent } from '../components/OrderItemComponent.tsx';
import ButtonWithPrompt from '../components/popup/ButtonWithPrompt.tsx';
import { ReactComponent as ConfirmIcon } from "../assets/confirm.svg"
import CheckBox from '../components/input/CheckBox.tsx';
import { countProduct } from '../utility/generic.ts';
import { AppStateCtx, backendServer } from '../App.tsx';
import { useNavigate } from 'react-router-dom';


// Main OrderPage
const OrderPage: React.FC = () => {
    const navigate = useNavigate();
    const [appState] = useContext(AppStateCtx);

    const [orderDocumentId, setOrderDocumentId] = useState<string | null>(null);
    const [itemsByCategory, setItemsByCategory] = useState({});
    const [antFirst, setAntFirst] = useState(false);

    useEffect(() => {
        fetchOrderData();
    }, [appState.table]);

    const fetchOrderData = async () => {
        try {
            const order = await backendServer.orders.fetchCurrentOrder(appState.table);
            if (order) {
                setOrderDocumentId(order.documentId);
                await organizeItems(order.products);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            navigate('/error'); // Redirect to an error page or handle differently
        }
    };

    const organizeItems = async (items) => {
        const itemsMap = {};

        const countedItems = countProduct(items);

        for (const item of countedItems) {
            const categoryId = item.category.id;
            if (categoryId) {
                if (!itemsMap[categoryId]) {
                    itemsMap[categoryId] = {
                        name: item.category.Name,
                        items: []
                    };
                }

                if (item.Name === 'Custom') {
                    item.ingredients = await fetchIngredients(item.documentId);
                }

                itemsMap[categoryId].items.push(item);
            }
        }

        setItemsByCategory(itemsMap);
    };

    const fetchIngredients = async (productId) => {
        try {
            const response = await backendServer.products.getProductIngredients(productId);
            return response || [];
        } catch (error) {
            console.error('Failed to fetch ingredients for product:', productId, error);
            return []; // Continue to handle other items even if one fails
        }
    };

    const toggleAnt = () => setAntFirst(!antFirst);

    return (
        <>
            <Header pageName="Ordine" current={Pages.Order} />
            <div className="p-4" style={{ marginTop: '100px' }}>
                <div style={{ maxHeight: '70%', overflowY: 'scroll' }}>
                    {Object.keys(itemsByCategory).sort((a, b) => antFirst ? b.localeCompare(a) : a.localeCompare(b))
                        .map(categoryId => {
                            const category = itemsByCategory[categoryId];
                            return category.items.length > 0 && (
                                <OrderCategoryComponent key={categoryId} title={category.name} items={category.items} />
                            );
                        })}
                </div>

                <div style={{
                    position: 'fixed', bottom: 0, width: '90%'
                }}>
                    <CheckBox value={antFirst} text="Prima gli antipasti." onChange={toggleAnt} />
                    <ButtonWithPrompt
                        className='dark-btn check-btn'
                        variant="success w-100" size="lg"
                        popupTitle="Conferma l'Ordine"
                        confirmText="Conferma"
                        confirmClass='err-btn confirm-btn'
                        confirmSvg={<ConfirmIcon />}
                        onClick={() => {
                            backendServer.orders.confirmOrder(orderDocumentId, antFirst);
                            navigate('/conto');
                        }}>
                        Conferma Ordine
                    </ButtonWithPrompt>
                </div>

            </div>
        </>
    );
};

export default OrderPage;