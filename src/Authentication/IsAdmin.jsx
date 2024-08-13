import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from './FirestoreApp';

const db = getFirestore(app);

export default async function Isadmin(adminEmail) {
    try {
        const userQuery = query(collection(db, 'users'), where('email', '==', adminEmail));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const isAdmin = userDoc.data().isAdmin;

            if (isAdmin) {
                console.log('The user is an admin.');
                return true;
            }
            return false;
        } else {
            console.log('No such admin found.');
            return false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}
