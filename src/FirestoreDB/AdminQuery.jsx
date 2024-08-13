import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../Authentication/FirestoreApp'; 
const db = getFirestore(app);

export async function fetchAllData() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users')); 

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function fetchStockData() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    
    const products = [];
    
    for (const docSnap of querySnapshot.docs) {
      const productId = docSnap.id;
      const doumentData = await getDocs(collection(db, `products/${productId}/${productId}`));
      for (const doument of doumentData.docs)
      {
        products.push({
         ...doument.data(),
        });
      }
    }
    // console.log('Fetched products data:', products);
    return products;
  } 
  catch (error) {
    // console.error('Error fetching data:', error);
  }
}

export async function fetchPurchasedData() {
  try {
    const querySnapshot = await getDocs(collection(db, "checkout"));

    const userData = [];

    for (const docSnap of querySnapshot.docs) {
      const productId = docSnap.id;
      const documentData = docSnap.data();

      if (documentData.purchases) {
        documentData.purchases.forEach((purchase) => {
          userData.push(
            ...purchase.items.map((item) => ({
              ...item,
              email: productId,
              totalPrice: purchase.totalPrice,
            }))
          );
        });
      }
    }

    console.log(userData);
    return userData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}