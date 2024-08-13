import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Root = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
        <Footer />
        <ToastContainer/>
    </div>
  );
};

export default Root;
