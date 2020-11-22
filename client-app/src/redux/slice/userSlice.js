import {createSlice} from '@reduxjs/toolkit';

const initialState = {
   account_id: null,
   user_id: null,
   role: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state = {...action.payload}
            return state;
        },
        removeUser: (state, action) => {
            return initialState;
        }
    }
})

const {reducer, actions} = userSlice;
export default reducer;
export const {setUser, removeUser} = actions;