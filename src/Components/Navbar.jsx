import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { setUser, resetUser } from '../ReduxStore/userloginslice';
import firestoreApp from '../Authentication/FirestoreApp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import { resetitems } from '../ReduxStore/cartSlice';

// Initialize Firebase Auth
const auth = getAuth(firestoreApp);

export default function Navbar() {
  const navigate = useNavigate();
  const status = useSelector((state) => state.cart.isAdmin);
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Handle search input changes
  const onChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setValue(searchValue);

    const products = JSON.parse(localStorage.getItem('products'));

    if (searchValue.trim() !== '') {
      const filtered = products.filter((product) =>
        product.Name.toLowerCase().startsWith(searchValue)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // Handle Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, email, uid } = currentUser;
        dispatch(setUser({ name: displayName, email, uid }));
      } else {
        dispatch(resetUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Handle logout
  const handleLogout = async () => {
    try {
      dispatch(resetitems());
      await signOut(auth);
      toast.success('Logged Out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Navbar brand/logo */}
        <NavLink className="navbar-brand" to={status ? '/' : '/'}>
          {status ? 'Admin' : 'E-commerce'}
        </NavLink>

        {/* Navbar toggler for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"   // Use 'data-bs-toggle' instead of 'data-toggle' for Bootstrap 5
          data-bs-target="#navbarSupportedContent" // Ensure this ID matches the collapse div ID
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navbar content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <NavLink className="nav-link" aria-current="page" to={status ? '/UserDetails' : '/'}>
                {status ? 'Users' : 'Home'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={status ? '/StockDetails' : '/Shop'}>
                {status ? 'Stocks' : 'Shop'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={status ? '/PurchasedDetails' : '/Contact'}>
                {status ? 'Purchased' : 'Contact'}
              </NavLink>
            </li>
          </ul>

          {/* Welcome message */}
          <div className="navbar-text mx-auto">
            {user && user.name ? `Welcome, ${user.name}` : ''}
          </div>

          {/* Right-aligned navbar items */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {!status && (
                <form className="d-flex ms-2">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search products"
                    aria-label="Search"
                    onChange={onChange}
                    value={value}
                  />
                </form>
              )}
              {filteredProducts.length > 0 && (
                <ul className="dropdown-content list-group">
                  {filteredProducts.map((product, index) => (
                    <li key={index} className="list-group-item">
                      <NavLink to={`/productdetail/${product.categoryName}/${product.id}`}>
                        {product.Name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Login/Logout link */}
            <li className="nav-item">
              {user && user.name ? (
                <NavLink className="nav-link" to="/" onClick={handleLogout}>
                  <i className="bi bi-person"></i> Logout
                </NavLink>
              ) : (
                <NavLink className="nav-link" to="/Login">
                  <i className="bi bi-person"></i> Login
                </NavLink>
              )}
            </li>

            {/* Cart icon with item count */}
            <li className="nav-item position-relative">
              {!status && (
                <NavLink className="nav-link" to="/Cart">
                  <FaShoppingCart />
                  <span
                    className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${cartItems.length > 0 ? 'bg-danger' : 'bg-secondary'}`}
                    style={{ fontSize: '0.75em' }}
                  >
                    {cartItems.length > 0 ? cartItems.length : '0'}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
