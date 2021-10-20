import React from "react";
import { createContext, useReducer } from "react";
import { actionTypes } from "./types";

const initialValues = {
    isLoading: false,
    hasError: false,
    loadingError: false,
    products: [{}],
    handleDownVote: () => { },
    handleUpVote: () => { },
    handleSetFavorite: () => { },
    handleSaveNewProduct: () => { },
    cartItems: [{}],
    handleAddToCart: () => { },
    handleRemove: () => { },
    handleChange: () => { },
};


function reducer(state, action) {
    switch (action.type) {
        case actionTypes.LOAD_LOCAL_STORAGE:
            return {
                ...state,
                isLoading: true,
                hasError: false,
                loadingError: false
            }
        case actionTypes.HANDLER_ADD_TO_CART:
            return {
                ...state,
            }
        case actionTypes.HANDLER_CHANGE:
            return {
                ...state,
            }
        case actionTypes.HANDLER_REMOVE:
            return {
                ...state,
            }
        case actionTypes.HANDLER_DOWN_VOTE:
            return {
                ...state,
            }
        case actionTypes.HANDLER_UP_VOTE:
            return {
                ...state,
            }
        case actionTypes.HANDLER_SET_FAVORITE:
            return {
                ...state,
            }

        default:
            return state
    }
} export { reducer }

const productContext = createContext(initialValues)
const ProductProvider = ({ children }) => {
    const [store, dispatch] = useReducer(reducer, initialValues)

    return (
        <productContext.Provider value={[store, dispatch]}>
            {children}
        </productContext.Provider>
    );
}
export default ProductProvider
export { productContext }

// const useStateContext = () => useContext(productContext)[0]
// const useDispatch = () => useContext(productContext)[1]
// export { useStateContext, useDispatch }