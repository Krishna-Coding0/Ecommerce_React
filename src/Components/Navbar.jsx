import {useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { setUser, resetUser } from '../ReduxStore/userloginslice';
import firestoreApp from '../Authentication/FirestoreApp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import { resetitems} from '../ReduxStore/cartSlice';


const auth = getAuth(firestoreApp);

export default function Navbar() {
  const navigate = useNavigate();
  const status=useSelector((state)=>state.cart.isAdmin)
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();


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

  



  const handleLogout = async () => {
    try {
      dispatch(resetitems())
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
      <NavLink className="navbar-brand" to={status ? '/' : '/'}>
          {status ? 'Admin' : 'E-commerce'}
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to={status ? '/UserDetails' : '/'}>
                
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
          <div className="navbar-text mx-auto">
            {user && user.name ? `Welcome, ${user.name}` : ''}
          </div>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {status ? '' : <form className="d-flex ms-2">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search products"
                  aria-label="Search"
                  />
                <button className="btn btn-outline-success">
                  Search
                </button>
              </form>}
              
              
            </li>
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
            <li className="nav-item position-relative">
                {status ? '' : <NavLink className="nav-link" to="/Cart">
                <FaShoppingCart />
                <span
                  className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${cartItems.length > 0 ? 'bg-danger' : 'bg-secondary'}`}
                  style={{ fontSize: '0.75em' }}
                >
                  {cartItems.length > 0 ? cartItems.length : '0'}
                  <span className="visually-hidden">items in cart</span>
                </span>
              </NavLink>}
              
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
