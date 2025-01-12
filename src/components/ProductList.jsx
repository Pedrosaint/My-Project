import React, { useEffect, useState } from "react";
import { db } from "./Firebase/Firebase";
import { collection, getDocs } from "./Firebase/Firebase";
import { useContext } from "react";
import { CartContext } from "../components/context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "newproducts");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
