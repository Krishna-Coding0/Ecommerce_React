import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import app from "../Authentication/FirestoreApp";

const auth = getAuth(app);
const db = getFirestore(app);

export const fetchUserCart = async () => {
  const user = auth.currentUser;
  if (user) {
    const email = user.email;
    const querySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log('userDoc',userDoc)
      const userDocId = userDoc.id;
      console.log('userDocId',userDocId)
      const cartCollection = collection(db, `users/${userDocId}/cart`);
      const cartSnapshot = await getDocs(cartCollection);
      console.log('carst snapshot',cartSnapshot)
      return {
        userDocId,
        items: cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    } else {
      throw new Error("User not found in database.");
    }
  } else {
    throw new Error("User is not logged in.");
  }
};
