import React, { useCallback } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firestoreApp from "../Authentication/FirestoreApp";
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../ReduxStore/cartSlice";
import { addtoCart } from '../FirestoreDB/AddtoCart';

const db = getFirestore(firestoreApp);

const fetchProducts = async (categoryName) => {
  const collectionPath = `products/${categoryName}/${categoryName}`;
  const collectionRef = collection(db, collectionPath);
  const querySnapshot = await getDocs(collectionRef);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default function Shop() {
  const dispatch = useDispatch();
  const userstatus = useSelector((state) => state.cart.userloggedIn);
  const cartItems = useSelector((state) => state.cart.items.map(item => item.id));
  const [selectedCategory, setSelectedCategory] = React.useState("Electronics");

  const handleAddToCart = useCallback(
    async (product) => {
      if (userstatus) {
        if (!cartItems.includes(product.id)) {
          dispatch(addItem(product));
          addtoCart(product);
          toast.success("Product Added From Shop", selectedCategory);
        } else {
          toast.info("Product is already in the cart");
        }
      } else {
        toast.error('Please Login to Add Product to Cart');
      }
    },
    [dispatch, userstatus, cartItems, selectedCategory]
  );

  const { data: products = [], error, isLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
    enabled: !!selectedCategory,
  });

  const categories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "TVandAppliances" },
    { name: "Column" },
  ];

  return (
    <div>
      <div className="container text-center my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
          {categories.map((category, index) => (
            <div className="col" key={index}>
              <button
                onClick={() => setSelectedCategory(category.name)}
                className="btn btn-primary"
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="container text-center my-5">
        <h3>{selectedCategory}</h3>
        {isLoading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : error ? (
          <div>Error fetching data: {error.message}</div>
        ) : (
          <div className="row">
            {products.length > 0 ? (
              products.map((item) => {
                const price = typeof item.Price === "number" ? item.Price : 0;
                const isItemInCart = cartItems.includes(item.id);

                return (
                  <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
                    <div className="card h-100">
                      <Link
                        to={`/productdetail/${selectedCategory}/${item.id}`}
                      >
                        <img
                          src={item.ImageURL || "default_image_url"}
                          className="card-img-top"
                          alt={item.Name}
                        />
                      </Link>
                      <div className="card-body">
                        <h5 className="card-title">{item.Name}</h5>
                        <p className="card-text">${price.toFixed(2)}</p>
                        {!isItemInCart ? (
                          <button
                            onClick={() => handleAddToCart(item)}
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
                  </div>
                );
              })
            ) : (
              <p>No data available for {selectedCategory}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
