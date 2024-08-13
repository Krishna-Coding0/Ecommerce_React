import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ErrorModal from './ErrorModal';
import { setUser } from '../ReduxStore/userloginslice';
import { useNavigate } from 'react-router-dom';
import useFirestoreDB from '../FirestoreDB/firestoreDB';
import { toast } from 'react-toastify';
import { adminstatus ,userstatus,addItem} from "../ReduxStore/cartSlice";
import  IsAdmin from './IsAdmin'; 
import { fetchUserCart } from "../NavbarPages/FetchCartApi"; 
import app from "../Authentication/FirestoreApp";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addUser } = useFirestoreDB();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    retypePassword: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (event) => {
    event.preventDefault();
    const { name, email, password, retypePassword } = formData;

    if (password !== retypePassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', response.user);
      dispatch(setUser({ uid: response.user.uid, name, email }));
      await addUser(name, email);
      toast.success('Logged in successfully!');
      navigate('/Login');
    } catch (error) {
      setFormData({ ...formData, message: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google user:', user);
      dispatch(setUser({ uid: user.uid, name: user.displayName, email: user.email }));
      await addUser(user.displayName, user.email);
      if (await IsAdmin(user.email)) {
        dispatch(adminstatus());
      }
      else{
        dispatch(userstatus());
      }
      const data=await fetchUserCart()
      console.log('this the data fetched :',data)
      data.items.forEach(item => {
        dispatch(addItem(item.product));
      });
      toast.success('Logged in with Google successfully!');
      navigate('/');
    } catch (error) {
      setFormData({ ...formData, message: error.message });
    }
  };

  const closeModal = () => {
    setFormData({ ...formData, message: '' });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Sign Up</h5>
          <form onSubmit={createUser}>
            <div className="form-group">
              <label htmlFor="nameInput">Name</label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="retypePasswordInput">Retype Password</label>
              <input
                type="password"
                className="form-control"
                id="retypePasswordInput"
                name="retypePassword"
                placeholder="Retype Password"
                value={formData.retypePassword}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button type="submit" className="btn btn-primary w-75">Sign Up</button>
              <button type="button" className="btn btn-outline-primary w-48 d-flex align-items-center justify-content-center" onClick={handleGoogleLogin}>
                <i className="fab fa-google"></i> Google
              </button>
            </div>
            <NavLink to='/Login' className="d-block text-center text-decoration-none mt-3">Already have an account? Login</NavLink>
          </form>
        </div>
      </div>

      <ErrorModal message={formData.message} onClose={closeModal} />
    </div>
  );
}
