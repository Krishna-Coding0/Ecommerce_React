import { getFirestore, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import firestoreApp from "../Authentication/FirestoreApp";

const db = getFirestore(firestoreApp);

export default function useFirestoreDB() {
  const addUser = async (name, email) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "users"), {                   
          name: name,      
          email: email  
        });
      } else {
        // console.log("User already exists");
      }
    } catch (e) {
      // console.error("Error adding document: ", e);
    }
  };

  return { addUser };
}
