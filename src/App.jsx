import Home from './Components/Home';
import Root from './Components/Root';
import Cart from './NavbarPages/DisplayCart';
import Contact from './NavbarPages/Contact';
import Shop from './NavbarPages/Shop';
import Checkout from './NavbarPages/CheckOut';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import ProductDetail from './NavbarPages/ProductDetails'; 
import Recept from './NavbarPages/ProductDetails'; 
import { Provider } from 'react-redux';
import store from "./ReduxStore/Store";
import Footer from './Components/Footer';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider,QueryClient } from '@tanstack/react-query';
import  PurchasedDetails  from './Components/Admin/PurchasedDetails';
import  StockDetails  from './Components/Admin/StockDetails';
import  UserDetails  from './Components/Admin/UserDetails';


const queryClient=new QueryClient();

const router = createBrowserRouter([
  { 
    path: '/',
    element: <Root />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'Cart', element: <Cart /> },
      { path: 'Contact', element: <Contact /> },
      { path: 'Shop', element: <Shop /> },
      { path: 'Login', element: <Login /> },
      { path: 'Signup', element: <Signup /> },
      { path: 'productdetail/:categoryName/:id', element: <ProductDetail /> }, 
      { path: 'Cart/Checkout', element: <Checkout /> }, 
      { path: 'PurchasedDetails', element: <PurchasedDetails /> }, 
      { path: 'StockDetails', element: <StockDetails /> }, 
      { path: 'UserDetails', element: <UserDetails /> }, 
      { path: 'Recept', element: <Recept /> }, 
      { path: 'Footer', element: <Footer /> }, 
    ]
  }
]);

function App() {
  return (

    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    </QueryClientProvider>
  );
}

export default App;
