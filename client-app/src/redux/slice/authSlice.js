import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    role: null,
};

const authSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        modifyRole: (state, action) => {
            state.role = action.payload;
        },
    },
});

const { reducer, actions } = authSlice;
export default reducer;
export const { modifyRole } = actions;
