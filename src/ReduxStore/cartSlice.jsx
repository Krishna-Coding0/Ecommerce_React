import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: 
  {
    items: [],
    temp:[],
    userloggedIn: false,
    isAdmin: false,
  },
  reducers: 
  {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
      
    },
    userstatus: (state) => 
      {
      state.userloggedIn=true;
      },
      
    removeItem: (state, action) => 
      {
      state.items = state.items.filter(item => item.id !== action.payload);
      // console.log(state.items)
      },
    itemAddedToCart:(state, action)=>
      {
        state.items.push(action.payload);
      },
      adminstatus: (state) =>
      {
        state.isAdmin=true;
      },
      resetitems: (state) => {
        state.items = [];
        // state.userloggedIn = false;
        state.isAdmin = false; 
      },
      Tempdata:(state,action)=>{
        console.log("Payload:", action.payload);
        state.temp=[...state.temp, action.payload]
        console.log("Updated Temp:", state.temp);
      },
      resetTemp:(state)=>{
        state.temp=[]
      }
  },
});

export const {resetTemp, addItem, removeItem ,userstatus, adminstatus, resetitems , resetadminstatus ,Tempdata} = cartSlice.actions;
export default cartSlice;
