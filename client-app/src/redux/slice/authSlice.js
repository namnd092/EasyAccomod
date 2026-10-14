import { createSlice } from '@reduxjs/toolkit';
import { hasSessionHint } from '../../api/accessToken';

// `token` mirrors the in-memory access token for the UI. `restoring` is true while a returning
// visitor's session is being restored from the refresh cookie, so guards wait instead of redirecting.
const authSlice = createSlice({
    name: 'auth',
    initialState: () => ({ token: null, restoring: hasSessionHint() }),
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        },
        finishRestoring: (state) => {
            state.restoring = false;
        },
    },
});

const { reducer, actions } = authSlice;
export default reducer;
export const { setToken, clearToken, finishRestoring } = actions;
