import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
name:'userlogin',
initialState:{
    uid:'',
    name:'',
    email: '',

},
reducers:{
    setUser: (state, action) => {
        const { uid, name, email } = action.payload;
        state.uid = uid;
        state.name = name;
        state.email = email;

    },
    resetUser: (state) => {
        state.uid = '';
        state.name = '';
        state.email = '';
    }
}


})


export const {setUser, resetUser } = userSlice.actions;
export default userSlice;