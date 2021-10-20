import loadLocalStorageItems from "../utils/loadLocalStorageItems"

export const actionTypes = {
    HANDLER_DOWN_VOTE: handleDownVote,
    HANDLER_UP_VOTE: handleUpVote,
    HANDLER_SET_FAVORITE: handleSetFavorite,
    HANDLER_ADD_TO_CART: handleAddToCart,
    HANDLER_REMOVE: handleRemove,
    HANDLER_CHANGE: handleChange,
    LOAD_LOCAL_STORAGE: loadLocalStorageItems,
  }


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

      setCartItems(updatedCartItems);
      return;
    }

  const updatedProduct = buildNewCartItem(foundProduct);
  setCartItems((prevState) => [...prevState, updatedProduct]);
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

  setCartItems(updatedCartItems);
}

function handleRemove(productId) {
  const updatedCartItems = cartItems.filter((item) => item.id !== productId);

  setCartItems(updatedCartItems);
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

  setProducts(updatedProducts);
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

  setProducts(updatedProducts);
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

  setProducts(updatedProducts);
}

function saveNewProduct(newProduct) {
  setProducts((prevState) => [newProduct, ...prevState]);
}