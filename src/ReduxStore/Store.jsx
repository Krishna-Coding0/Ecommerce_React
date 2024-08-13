import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userloginslice";
import cartReducer from './cartSlice';

const store=configureStore({
    reducer:{
        user:userSlice.reducer,
        cart:cartReducer.reducer,
    }}
)

export default store;