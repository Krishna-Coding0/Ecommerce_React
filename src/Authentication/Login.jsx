import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import ErrorModal from './ErrorModal'; 
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux';
import { setUser } from '../ReduxStore/userloginslice';
import { adminstatus, userstatus, addItem ,resetTemp} from "../ReduxStore/cartSlice";
import IsAdmin from './IsAdmin'; 
import { fetchUserCart } from "../NavbarPages/FetchCartApi";
import firestoreApp from './FirestoreApp';
import {addtoCart} from '../FirestoreDB/AddtoCart';

const auth = getAuth(firestoreApp);
const provider = new GoogleAuthProvider();

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const temp = useSelector((state) => state.cart.temp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  console.log(temp);
  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      console.log('User signed in:', response.user);
      dispatch(setUser({ uid: response.user.uid, email: response.user.email }));
      
      // Fetch user cart and handle it similarly to signup
      const data = await fetchUserCart();
      console.log('Fetched cart data:', data);
      data.items.forEach(item => {
        dispatch(addItem(item.product));
      });

      // Check for admin status
      if (await IsAdmin(response.user.email)) {
        dispatch(adminstatus());
      } else {
        dispatch(userstatus());
      }
      
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log('Google user:', user);
      dispatch(setUser({ uid: user.uid, name: user.displayName, email: user.email }));
      
      // await addUser(user.displayName, user.email);
      if (await IsAdmin(user.email)) {
        dispatch(adminstatus());
      }
      else{
        dispatch(userstatus());
          for (const item of temp) {
            console.log(item);
            await addtoCart(user.email, item);
            dispatch(addItem(item));
        }
      }
      const data=await fetchUserCart()
      console.log('this the data fetched :',data)
      data.items.forEach(item => {
        dispatch(addItem(item.product));
      });
      toast.success('Logged in with Google successfully!');
      dispatch(resetTemp())
      navigate('/');
    } catch (error) {
      // setFormData({ ...formData, message: error.message });
    }
  };

  const closeModal = () => {
    setMessage('');
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Sign In</h5>
          <form onSubmit={handleEmailSignIn}>
            <div className="form-group mt-3">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary my-3 w-100">Sign in</button>
            <button type="button" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" onClick={handleGoogleSignIn}>
              <i className="fab fa-google me-2"></i> Sign in with Google
            </button>
            <NavLink to='/Signup' className="d-block text-center text-decoration-none mt-3">Create Account</NavLink>
          </form>
        </div>
      </div>

      <ErrorModal message={message} onClose={closeModal} />
    </div>
  );
}
