import React, { useContext } from "react";
import { productContext } from "../../contextandreducer/productProvider";
import ItemCard from "../ItemCard";

function ProductsListing() {
  const [store, dispatch] = useContext(productContext)
   const {
     products,
    handleDownVote,
    handleUpVote,
    handleSetFavorite,
    handleAddToCart,
    ...props
  } = store

  return (

    <section className="row" {...props}>
      {products.map((product) => (
        <ItemCard
          key={product.id}
          id={product.id}
          img={product.img}
          title={product.title}
          shortDescription={product.shortDescription}
        />
      ))}
    </section>
  );
}

export default ProductsListing;
