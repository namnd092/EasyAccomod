import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accountId: null,
    userId: null,
    role: null,
    name: null,
    address: null,
    identification: null,
    email: null,
    phone: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state = { ...action.payload };
            return state;
        },
        removeUser: (state, action) => {
            return initialState;
        },
    },
});

const { reducer, actions } = userSlice;
export default reducer;
export const { setUser, removeUser } = actions;
