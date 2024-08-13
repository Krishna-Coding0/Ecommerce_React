// import { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
//   addDoc,
// } from "firebase/firestore";
// import app from "../Authentication/FirestoreApp";
// import "./Checkout.css";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { resetitems } from "../ReduxStore/cartSlice";

// const auth = getAuth(app);
// const db = getFirestore(app);

// export default function Checkout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [userDocId, setUserDocId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const cartTotal = useSelector((state) => state.cart.total);
//   const cartitems = useSelector((state) => state.cart.items);
// console.log('current crat items', cartitems)
//   useEffect(() => {
//     const fetchUserCart = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const email = user.email;
//           const userQuery = query(
//             collection(db, "users"),
//             where("email", "==", email)
//           );
//           const querySnapshot = await getDocs(userQuery);

//           if (!querySnapshot.empty) {
//             const userDoc = querySnapshot.docs[0];
//             const userDocId = userDoc.id;
//             setUserDocId(userDocId);
//             const cartCollection = collection(db, `users/${userDocId}/cart`);
//             const cartSnapshot = await getDocs(cartCollection);
//             const items = cartSnapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }));
//             setCartItems(items);
//           } else {
//             throw new Error("User not found in database.");
//           }
//         } else {
//           throw new Error("User is not logged in.");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserCart();
//   }, []);

//   const handlePurchase = async () => {
//     try {
//       if (!userDocId) 
//         throw new Error("User document ID is missing");

//       const cartSnapshot = await getDocs(collection(db, `users/${userDocId}/cart`));
//       const user = auth.currentUser;
//       const userEmail = user ? user.email : '';
//       await addDoc(collection(db, `checkout/${userEmail}/items`), {
//         items: cartItems.map(item => ({ id: item.id, ...item.product })),
//         totalPrice: calculateTotalPrice(),
//       });
//       cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    
//       dispatch(resetitems())
//       setCartItems([]);
//       navigate('/');
//       // navigate('/Recept');
//       toast.success("Your purchase was successful! Items have been dispatched.");
//     } catch (error) {
//       console.error(`Error during purchase: ${error.message}`);
//       toast.error(`Error during purchase: ${error.message}`);
//     }
//   };


//   const calculateTotalPrice = () => {
//     return cartItems.reduce((total, item) => {
//       const itemPrice = item.product.Price || 0;
//       const itemQuantity = item.quantity || 1;
//       return total + itemPrice * itemQuantity;
//     }, 0).toFixed(2); 
//   };

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center">
//         <div className="spinner-border" role="status"></div>
//       </div>
//     );
//   }

//   if (error) return <div>{error}</div>;

//   return (
//     <div className="checkout-container">
//       <h1 className="checkout-header">Checkout</h1>
//       {cartItems.length > 0 ? (
//         <div>
//           <ul className="checkout-item-list">
//             {cartItems.map((item) => (
//               <li key={item.id} className="checkout-item">
//                 {item.product.ImageURL && (
//                   <img
//                     src={item.product.ImageURL}
//                     alt={item.product.Name || "No Name"}
//                   />
//                 )}
//                 <div className="checkout-item-details">
//                   <h2 className="checkout-item-title">
//                     {item.product.Name || "No Name"}
//                   </h2>
//                   <p className="checkout-item-category">
//                     Category: {item.product.Category || "No Category"}
//                   </p>
//                   <p className="checkout-item-price">
//                     Price: $
//                     {item.product.Price !== undefined
//                       ? item.product.Price
//                       : "No Price"}
//                   </p>
//                   <p className="checkout-item-quantity">
//                     Quantity: {item.quantity || 1}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <div className="checkout-summary">
//             <h3>Total Price: ${calculateTotalPrice()}</h3>
//           </div>
//           <button
//             className="purchase-button"
//             onClick={handlePurchase}
//           >
//             Purchase
//           </button>
//         </div>
//       ) : (
//         <p className="empty-cart-message">Your cart is empty.</p>
//       )}
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import app from "../Authentication/FirestoreApp";
import "./Checkout.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetitems } from "../ReduxStore/cartSlice";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [userDocId, setUserDocId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemsRedux = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const email = user.email;
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", email)
          );
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userDocId = userDoc.id;
            setUserDocId(userDocId);
            const cartCollection = collection(db, `users/${userDocId}/cart`);
            const cartSnapshot = await getDocs(cartCollection);
            const items = cartSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCartItems(items);
          } else {
            throw new Error("User not found in database.");
          }
        } else {
          throw new Error("User is not logged in.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCart();
  }, []);

  const handlePurchase = async () => {
    try {
      if (!userDocId) throw new Error("User document ID is missing");

      const cartSnapshot = await getDocs(
        collection(db, `users/${userDocId}/cart`)
      );
      const user = auth.currentUser;
      const userEmail = user ? user.email : "";
      const userName = user ? user.displayName.replace(/\s+/g, "") : "UnknownUser";

      // Add a timestamp to each purchase item
      const purchaseData = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.product.Name || "No Name",
          price: item.product.Price || 0,
          quantity: item.quantity || 1,
          totalPrice: (item.product.Price || 0) * (item.quantity || 1),
          timestamp: new Date().toISOString(), // Add current timestamp
        })),
        totalPrice: parseFloat(calculateTotalPrice()),
      };

      // Get reference to the document in Firestore
      const docRef = doc(db, "checkout", `${userName}-${userEmail}`);

      // Check if document already exists
      const docSnapshot = await getDocs(collection(db, "checkout"));
      const existingDoc = docSnapshot.docs.find(
        (doc) => doc.id === `${userName}-${userEmail}`
      );

      if (existingDoc) {
        // If the document exists, update it with the new purchase
        await updateDoc(docRef, {
          purchases: arrayUnion(purchaseData),
        });
      } else {
        // If the document does not exist, create it
        await setDoc(docRef, {
          userName: userName,
          email: userEmail,
          purchases: [purchaseData],
        });
      }

      // Delete items from the cart in Firestore
      cartSnapshot.docs.forEach((doc) => deleteDoc(doc.ref));

      dispatch(resetitems());
      setCartItems([]);
      navigate("/");
      toast.success(
        "Your purchase was successful! Items have been dispatched."
      );
    } catch (error) {
      console.error(`Error during purchase: ${error.message}`);
      toast.error(`Error during purchase: ${error.message}`);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = item.product.Price || 0;
        const itemQuantity = item.quantity || 1;
        return total + itemPrice * itemQuantity;
      }, 0)
      .toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      {cartItems.length > 0 ? (
        <div>
          <ul className="checkout-item-list">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-item">
                {item.product.ImageURL && (
                  <img
                    src={item.product.ImageURL}
                    alt={item.product.Name || "No Name"}
                  />
                )}
                <div className="checkout-item-details">
                  <h2 className="checkout-item-title">
                    {item.product.Name || "No Name"}
                  </h2>
                  <p className="checkout-item-category">
                    Category: {item.product.Category || "No Category"}
                  </p>
                  <p className="checkout-item-price">
                    Price: $
                    {item.product.Price !== undefined
                      ? item.product.Price
                      : "No Price"}
                  </p>
                  <p className="checkout-item-quantity">
                    Quantity: {item.quantity || 1}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="checkout-summary">
            <h3>Total Price: ${calculateTotalPrice()}</h3>
          </div>
          <button className="purchase-button" onClick={handlePurchase}>
            Purchase
          </button>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
}

