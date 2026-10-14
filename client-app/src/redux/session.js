import authApi from '../api/authApi';
import { refreshSession } from '../api/axiosClient';
import { setAccessToken, setSessionHint, hasSessionHint } from '../api/accessToken';
import { setToken, clearToken, finishRestoring } from './slice/authSlice';
import { setUser, removeUser } from './slice/userSlice';

export const startSession = (token) => (dispatch) => {
    setAccessToken(token);
    setSessionHint(true);
    dispatch(setToken(token));
};

export const endSession = () => (dispatch) => {
    setAccessToken(null);
    setSessionHint(false);
    dispatch(clearToken());
    dispatch(removeUser());
};

// Logs out on the server (revoking the refresh token) and locally. The local session ends even if the call fails.
export const logout = () => async (dispatch) => {
    try {
        await authApi.logout();
    } finally {
        dispatch(endSession());
    }
};

// On page load: a browser that logged in before gets its session back from the refresh cookie.
export const restoreSession = () => async (dispatch) => {
    if (hasSessionHint()) {
        try {
            const { access_token } = await refreshSession();
            dispatch(startSession(access_token));
        } catch {
            // No valid cookie (expired, revoked, or cleared): the visitor is simply logged out.
            dispatch(endSession());
        }
    }
    dispatch(finishRestoring());
};

export const fetchAccountInfo = () => async (dispatch) => {
    const info = await authApi.getAccountInfoByToken();
    dispatch(setUser({ ...info }));
    return info;
};
