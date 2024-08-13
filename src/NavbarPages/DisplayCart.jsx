import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch ,useSelector} from "react-redux";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { fetchUserCart } from "./FetchCartApi"; 
import { removeItem } from "../ReduxStore/cartSlice";
import app from "../Authentication/FirestoreApp";
import "./Cart.css";
import { getFirestore} from "firebase/firestore";

const db = getFirestore(app);

export default function Cart() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // const items=useSelector((state)=>state.cart.items)
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ["userCart"],
    queryFn: fetchUserCart,
    refetchOnWindowFocus: false,
    onError: (err) => setError(err.message),
  });

  const cartItems = data?.items || [];
  const userDocId = data?.userDocId;

  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (!userDocId) return;

    const cartDoc = doc(db, `users/${userDocId}/cart`, productId);
    await updateDoc(cartDoc, { quantity: newQuantity });
    queryClient.invalidateQueries(["userCart"]);
  };

  const handleIncrement = async (productId) => {
    try {
      const cartItem = cartItems.find((item) => item.id === productId);
      if (cartItem) {
        const newQuantity = (cartItem.quantity || 1) + 1;
        await updateCartItemQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error(`Error incrementing quantity: ${error.message}`);
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const cartItem = cartItems.find((item) => item.id === productId);
      if (cartItem && (cartItem.quantity || 1) > 1) {
        const newQuantity = (cartItem.quantity || 1) - 1;
        await updateCartItemQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error(`Error decrementing quantity: ${error.message}`);
    }
  };

  const handleRemove = async (productId, name, id) => {
    try {
      if (!userDocId) return;
      dispatch(removeItem(id));
      toast.info(`Product ${name} Removed`);
      const cartDoc = doc(db, `users/${userDocId}/cart`, productId);
      await deleteDoc(cartDoc);
      queryClient.invalidateQueries(["userCart"]);
    } catch (error) {
      console.error(`Error removing item: ${error.message}`);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total + (item.product.Price || 0) * (item.quantity || 1),
        0
      )
      .toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error || queryError) return <div>{error || queryError.message}</div>;

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <ul className="cart-item-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                {item.product.ImageURL && (
                  <img
                    src={item.product.ImageURL}
                    alt={item.product.Name || "No Name"}
                  />
                )}
                <div className="cart-item-details">
                  <h2 className="cart-item-title">
                    {item.product.Name || "No Name"}
                  </h2>
                  <p className="cart-item-category">
                    Category: {item.product.Category || "No Category"}
                  </p>
                  <p className="cart-item-price">
                    Price: $
                    {item.product.Price !== undefined
                      ? item.product.Price
                      : "No Price"}
                  </p>
                </div>
                <div className="cart-controls">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="cart-button"
                  >
                    -
                  </button>
                  <p style={{ margin: "0 10px", fontSize: "18px" }}>
                    {item.quantity || 1}
                  </p>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="cart-button"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id, item.product.Name, item.product.id)}
                    className="cart-remove-button mx-2"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            Total Price: ${calculateTotalPrice()}
          </div>
          <Link to="Checkout">
            <button className="checkout-button">Proceed to Checkout</button>
          </Link>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
}
