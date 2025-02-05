import React, { useEffect, useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import NewProduct from "./pages/NewProduct";

import * as api from "./api";

import useLocalStorage from "./hooks/useLocalStorage";
import loadLocalStorageItems from "./utils/loadLocalStorageItems";
import CheckoutStepOne from "./pages/CheckoutStepOne/index"
import CheckoutStepTwo from "./pages/CheckoutStepTwo/index";
import CheckoutStepThree from "./pages/CheckoutStepThree/index"
import CheckoutStepFour from "./pages/CheckoutStepFour/index";

import HomeContext from "./context/homeContext/HomeContext";
import NewProductContext from "./context/homeContext/NewProductContext";
import {UserContextProvider} from "./context/userContext/userContex";


function buildNewCartItem(cartItem) {
  if (cartItem.quantity >= cartItem.unitsInStock) {
    return cartItem;
  }

  return {
    id: cartItem.id,
    title: cartItem.title,
    img: cartItem.img,
    price: cartItem.price,
    unitsInStock: cartItem.unitsInStock,
    createdAt: cartItem.createdAt,
    updatedAt: cartItem.updatedAt,
    quantity: cartItem.quantity + 1,
  };
}

const PRODUCTS_LOCAL_STORAGE_KEY = "react-sc-state-products";
const CART_ITEMS_LOCAL_STORAGE_KEY = "react-sc-state-cart-items";

const actionTypes = {
  FETCHING: "FETCHING",
  FETCH_DONE: "FETCH_DONE",
  FETCH_ERROR: "FETCH_ERROR",
  CHANGE_PRODUCTS: "CHANGE_PRODUCTS",
  CHANGE_CART: "CHANGE_CART",
  SAVE_PRODUCT: "SAVE_PRODUCT",
};

const initialState = {
  products: loadLocalStorageItems(PRODUCTS_LOCAL_STORAGE_KEY, []),
  cartItems: loadLocalStorageItems(CART_ITEMS_LOCAL_STORAGE_KEY, []),
  isLoading: false,
  hasError: false,
  loadingError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCHING:
      return { ...state, isLoading: true };
    case actionTypes.FETCH_DONE:
      return { ...state, products: [...action.payload], isLoading: false };
    case actionTypes.FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        loadingError: action.payload,
      };
    case actionTypes.CHANGE_PRODUCTS:
      return { ...state, products: [...action.payload] };
    case actionTypes.CHANGE_CART:
      return { ...state, cartItems: [...action.payload] };
    case actionTypes.SAVE_PRODUCT:
      return { ...state, products: [...products, action.payload] };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { products, cartItems, isLoading, hasError, loadingError } = state;
  useLocalStorage(products, PRODUCTS_LOCAL_STORAGE_KEY);
  useLocalStorage(cartItems, CART_ITEMS_LOCAL_STORAGE_KEY);

  useEffect(() => {
    if (products.length === 0) {
      dispatch({ type: actionTypes.FETCHING });

      api
        .getProducts()
        .then((data) => {
          dispatch({ type: actionTypes.FETCH_DONE, payload: data });
        })
        .catch((error) => {
          dispatch({ type: actionTypes.FETCH_ERROR, payload: error });
        });
    }
  }, []);

  function handleAddToCart(productId) {
    const prevCartItem = cartItems.find((item) => item.id === productId);
    const foundProduct = products.find((product) => product.id === productId);

    if (prevCartItem) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= item.unitsInStock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      });

      dispatch({ type: actionTypes.CHANGE_CART, payload: updatedCartItems });

      return;
    }

    const updatedProduct = buildNewCartItem(foundProduct);

    dispatch({
      type: actionTypes.CHANGE_CART,
      payload: [...cartItems, updatedProduct],
    });
  }

  function handleChange(event, productId) {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId && item.quantity <= item.unitsInStock) {
        return {
          ...item,
          quantity: Number(event.target.value),
        };
      }

      return item;
    });

    dispatch({ type: actionTypes.CHANGE_CART, payload: updatedCartItems });
  }
  function handleRemove(productId) {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);

    dispatch({ type: actionTypes.CHANGE_CART, payload: updatedCartItems });
  }
  function handleDownVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.downVotes.currentValue <
        product.votes.downVotes.lowerLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            downVotes: {
              ...product.votes.downVotes,
              currentValue: product.votes.downVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });
    dispatch({ type: actionTypes.CHANGE_PRODUCTS, payload: updatedProducts });
  }

  function handleUpVote(productId) {
    const updatedProducts = products.map((product) => {
      if (
        product.id === productId &&
        product.votes.upVotes.currentValue < product.votes.upVotes.upperLimit
      ) {
        return {
          ...product,
          votes: {
            ...product.votes,
            upVotes: {
              ...product.votes.upVotes,
              currentValue: product.votes.upVotes.currentValue + 1,
            },
          },
        };
      }

      return product;
    });

    dispatch({ type: actionTypes.CHANGE_PRODUCTS, payload: updatedProducts });
  }

  function handleSetFavorite(productId) {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          isFavorite: !product.isFavorite,
        };
      }

      return product;
    });

    dispatch({ type: actionTypes.CHANGE_PRODUCTS, payload: updatedProducts });
  }

  function saveNewProduct(newProduct) {
    dispatch({
      type: actionTypes.CHANGE_PRODUCTS,
      payload: [newProduct, ...products],
    });
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/new-product">
          <NewProductContext.Provider
            value={{
              saveNewProduct: saveNewProduct,
            }}
          >
            <NewProduct />
          </NewProductContext.Provider>
        </Route>
        <Route path="/" exact>
          <HomeContext.Provider
            value={{
              cartItems: cartItems,
              products: products,
              isLoading: isLoading,
              hasError: hasError,
              loadingError: loadingError,
              handleDownVote: handleDownVote,
              handleUpVote: handleUpVote,
              handleSetFavorite: handleSetFavorite,
              handleAddToCart: handleAddToCart,
              handleRemove: handleRemove,
              handleChange: handleChange,
            }}
          >
            <Home fullWidth />
          </HomeContext.Provider>
        </Route>
        <UserContextProvider>
          <Route path="/checkout/step-1" exact>
            <CheckoutStepOne />
          </Route>
          <Route path="/checkout/step-2" exact>
            <CheckoutStepTwo />
          </Route>
          <Route path="/checkout/step-3" exact>
            <CheckoutStepThree />
          </Route>
          <Route path="/checkout/order-summary" exact>
            <CheckoutStepFour />
          </Route>
        </UserContextProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
