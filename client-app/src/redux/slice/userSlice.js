import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    name: 'Nguyen Duy Nam',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        renameUser: (state, action) => {
            state.name = action.payload
        }
    }
})

const {reducer, actions} = userSlice;
export default reducer;
export const {renameUser} = actions;