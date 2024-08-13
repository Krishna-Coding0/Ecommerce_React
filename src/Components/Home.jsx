import { useCallback } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firestoreApp from "../Authentication/FirestoreApp";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addItem } from "../ReduxStore/cartSlice";
import { addtoCart } from '../FirestoreDB/AddtoCart';
import "./Home.css";
import './Homestyles.css';

const db = getFirestore(firestoreApp);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const fetchProducts = async () => {
  const collectionRef = collection(db, "products");
  const querySnapshot = await getDocs(collectionRef);

  let allProducts = [];
  for (const doc of querySnapshot.docs) {
    const categoryId = doc.id;
    const subCollectionRef = collection(
      db,
      `products/${categoryId}/${categoryId}`
    );

    const subCollectionSnapshot = await getDocs(subCollectionRef);

    if (!subCollectionSnapshot.empty) {
      const subCollectionProducts = subCollectionSnapshot.docs.map(
        (subDoc) => ({
          id: subDoc.id,
          categoryName: categoryId,
          ...subDoc.data(),
        })
      );
      allProducts = [...allProducts, ...subCollectionProducts];
    }
  }

  return shuffleArray(allProducts);
};

const Home = () => {
  const dispatch = useDispatch();
  const userstatus = useSelector((state) => state.cart.userloggedIn);
  const email = useSelector((state) => state.user.email);
  const cartItems = useSelector((state) => state.cart.items.map(item => item.id));
  const { data: products, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  console.log('what is ',email)

  const handleAddToCart = useCallback(
    async (product) => {
      if (userstatus) {
        if (!cartItems.includes(product.id)) {
          dispatch(addItem(product));
          addtoCart(email,product);
          toast.success("Product Added From Home");
        } else {
          toast.info("Product is already in the cart");
        }
      } else {
        toast.error('Please Login to Add Product to Cart');
      }
    },
    [dispatch, userstatus, cartItems] // Dependencies array
  );

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card border-0 shadow-sm rounded">
              <Link to={`/productdetail/${product.categoryName}/${product.id}`}>
                <img
                  src={product.ImageURL || 'default_image_url'}
                  className="card-img-top rounded-top"
                  alt={product.Name}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              </Link>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">{product.Name}</h5>
                  <p className="card-text mb-0 text-muted">
                    ${product.Price ? product.Price.toFixed(2) : 'N/A'}
                  </p>
                </div>
                {!cartItems.includes(product.id) ? (
                  <button onClick={() => handleAddToCart(product)} className="btn btn-success w-100">
                    Add to Cart
                  </button>
                ) : (
                  <button disabled className="btn btn-secondary w-100">
                    Added to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
