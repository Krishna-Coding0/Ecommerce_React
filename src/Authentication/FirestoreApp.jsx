import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCyT3DzBNLH-SKeHPQN5Y4u5CJnbNmfrN4",
  authDomain: "ecommerce-7269d.firebaseapp.com",
  projectId: "ecommerce-7269d",
  storageBucket: "ecommerce-7269d.appspot.com",
  messagingSenderId: "757816795528",
  appId: "1:757816795528:web:e956d158fa9a532cb61a3d",
  measurementId: "G-H2BFGBKEX1"
};

const firestoreApp = initializeApp(firebaseConfig);

export default firestoreApp