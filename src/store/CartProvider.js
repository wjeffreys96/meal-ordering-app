import { useReducer } from 'react';
import CartContext from './cart-context';

const state = {
  items: [],
  totalAmount: 0,
};

const CartReducer = (state, action) => {
  let existingCartItemIndex;
  let updatedItems;
  let existingCartItem;
  switch (action.type) {
    case 'ADD_ITEM':
      const newTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;
      existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      existingCartItem = state.items[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.item.amount,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
      };

    case 'REMOVE_ITEM':
      existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const existingItem = state.items[existingCartItemIndex];
      const updatedTotalAmount = state.totalAmount - existingItem.price;
      if (existingItem.amount === 1) {
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        const updatedItem = {
          ...existingItem,
          amount: existingItem.amount - 1,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }
      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount,
      };
    default:
      console.log('error - no action type');
  }

  return state;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(CartReducer, state);

  const addItemToCart = (item) => {
    dispatchCartAction({ type: 'ADD_ITEM', item: item });
  };

  const removeItemFromCart = (id) => {
    dispatchCartAction({ type: 'REMOVE_ITEM', id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
