import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../Authentication/FirestoreApp";
import "./Receipt.css";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Receipt() {
  const [purchasedData, setPurchasedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const email = user.email
          const querySnapshot = await getDocs(collection(db, 'checkout'));

          const userData = [];

          for (const docSnap of querySnapshot.docs) {
            const productId = docSnap.id;
            const documentData = await getDocs(collection(db, `checkout/${productId}/items`));

            for (const document of documentData.docs) {
              const itemData = document.data();
              if (itemData.items) {
                userData.push(...itemData.items.map(item => ({ ...item, email: productId })));
              }
            }
          }

          setPurchasedData(userData);
        } else {
          throw new Error("User is not logged in.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedData();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  const groupedData = purchasedData.reduce((acc, item) => {
    if (!acc[item.email]) {
      acc[item.email] = [];
    }
    acc[item.email].push(item);
    return acc;
  }, {});

  return (
    <div className="receipt-container">
      <h1 className="receipt-header">Receipt</h1>
      {Object.entries(groupedData).map(([email, items]) => (
        <div key={email} className="receipt-section">
          <h2>User: {email}</h2>
          {items.length > 0 ? (
            <div>
              <ul className="receipt-item-list">
                {items.map((item, index) => (
                  <li key={index} className="receipt-item-detail">
                    <h3>{item.Name || "No Name"}</h3>
                    <p>Category: {item.Category || "No Category"}</p>
                    <p>Price: ${item.Price !== undefined ? item.Price : "No Price"}</p>
                    <p>Quantity: {item.quantity || 1}</p>
                  </li>
                ))}
              </ul>
              <div className="receipt-total">
                <h3>Total Price: ${items.reduce((total, item) => {
                  const itemPrice = item.Price || 0;
                  const itemQuantity = item.quantity || 1;
                  return total + itemPrice * itemQuantity;
                }, 0).toFixed(2)}</h3>
              </div>
            </div>
          ) : (
            <p>No items found for this user.</p>
          )}
        </div>
      ))}
    </div>
  );
}
