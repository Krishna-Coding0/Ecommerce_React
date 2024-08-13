// import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import app from "../Authentication/FirestoreApp";
import { toast } from "react-toastify";


const db = getFirestore(app);


export const addtoCart = async (email,product) => {

      try {
        const userQuery = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userDocId = userDoc.id;
          const cartQuery = query(collection(db, `users/${userDocId}/cart`), where("product.id", "==", product.id));
          const cartQuerySnapshot = await getDocs(cartQuery);

          if (cartQuerySnapshot.empty) {
            await addDoc(collection(db, `users/${userDocId}/cart`), { 
              product: product,
              timestamp: new Date()
            });
            toast.success("Product added to cart!");
          } else {
            toast.info("Product is already in the cart.");
          }
        } else {
          toast.error("User not found in the database.");
        }
      } catch (error) {
        toast.error(`Error adding product to cart: ${error.message}`);
      }
    
  
};
