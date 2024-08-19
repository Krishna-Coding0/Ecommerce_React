import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, doc, getDoc ,where ,getDocs, query} from "firebase/firestore";
import firestoreApp from "../Authentication/FirestoreApp";
import { addItem } from "../ReduxStore/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../FirestoreDB/AddtoCart";
import { toast } from "react-toastify";

const db = getFirestore(firestoreApp);

export default function ProductDetails() {
  const { categoryName, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const dispatch = useDispatch();
  const userstatus = useSelector((state) => state.cart.userloggedIn);

  const updatedProduct = useMemo(() => {
    if (product && product.ID) {
      return {
        ...product,
        id: product.ID,
      };
    }
    return null;
  }, [product]);

  const handleAddToCart = async () => {
    if (userstatus) {
      if (updatedProduct) {
        console.log("Product to be added to cart", updatedProduct);
        dispatch(addItem(updatedProduct));
        setIsInCart(true);
        await addtoCart(updatedProduct);
      } else {
        console.error("Product ID is missing or invalid.");
      }
    } else {
      toast.error("Please Login to Add Product to Cart");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const docRef = doc(db, `products/${categoryName}/${categoryName}/${id}`);
        console.log('this is doc',docRef);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct({ ...productData, ID: docSnap.id });

          const cartRef = collection(db, "cart");
          const cartQuery = query(cartRef, where("id", "==", docSnap.id));
          const cartSnapshot = await getDocs(cartQuery);
          setIsInCart(!cartSnapshot.empty);
        } else {
          console.log("No such document with ID:", id);
        }
      } catch (error) {
        console.error("Error fetching document: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [categoryName, id]);

  return (
    <div className="container my-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        product && (
          <div className="row">
            <div className="col-md-6">
              <img
                src={product.ImageURL || "default_image_url"}
                className="img-fluid"
                alt={product.Name}
              />
            </div>
            <div className="col-md-6">
              <h1>{product.Name}</h1>
              <p>
                <strong>Price:</strong> $
                {product.Price ? product.Price.toFixed(2) : "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {product.Category || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {product.Description || "No description available"}
              </p>
              {!isInCart ? (
                <button
                  onClick={handleAddToCart}
                  className="btn btn-success"
                >
                  Add to Cart
                </button>
              ) : (
                <button disabled className="btn btn-secondary">
                  Added to Cart
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
