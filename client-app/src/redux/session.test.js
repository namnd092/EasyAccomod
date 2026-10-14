import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { startSession, endSession, logout, restoreSession } from './session';
import { setUser } from './slice/userSlice';
import { getAccessToken, hasSessionHint, setAccessToken, setSessionHint } from '../api/accessToken';
import authApi from '../api/authApi';
import * as axiosClientModule from '../api/axiosClient';

const makeStore = () => configureStore({ reducer: rootReducer });

afterEach(() => {
    setAccessToken(null);
    vi.restoreAllMocks();
});

describe('session', () => {
    it('starts logged out, and not restoring, for a first-time visitor', () => {
        const { auth } = makeStore().getState();
        expect(auth.token).toBeNull();
        expect(auth.restoring).toBe(false);
    });

    it('starts in the restoring state when this browser logged in before', () => {
        setSessionHint(true);
        const { auth } = makeStore().getState();
        expect(auth.token).toBeNull();
        expect(auth.restoring).toBe(true);
    });

    it('startSession keeps the token in memory only, and leaves a non-secret hint', () => {
        const store = makeStore();
        store.dispatch(startSession('abc'));
        expect(getAccessToken()).toBe('abc');
        expect(store.getState().auth.token).toBe('abc');
        expect(hasSessionHint()).toBe(true);
        expect(JSON.stringify({ ...localStorage })).not.toContain('abc');
    });

    it('endSession forgets the token, the hint and the user', () => {
        const store = makeStore();
        store.dispatch(startSession('abc'));
        store.dispatch(setUser({ name: 'Owner1', role: 'owner' }));
        store.dispatch(endSession());
        expect(getAccessToken()).toBeNull();
        expect(hasSessionHint()).toBe(false);
        expect(store.getState().auth.token).toBeNull();
        expect(store.getState().user.name).toBeNull();
    });
});

describe('restoreSession', () => {
    it('does not call the API for a visitor who never logged in', async () => {
        const refresh = vi.spyOn(axiosClientModule, 'refreshSession');
        const store = makeStore();
        await store.dispatch(restoreSession());
        expect(refresh).not.toHaveBeenCalled();
        expect(store.getState().auth.restoring).toBe(false);
    });

    it('logs a returning visitor back in from the refresh cookie', async () => {
        setSessionHint(true);
        vi.spyOn(axiosClientModule, 'refreshSession').mockResolvedValue({ access_token: 'fresh' });
        const store = makeStore();
        await store.dispatch(restoreSession());
        expect(store.getState().auth).toEqual({ token: 'fresh', restoring: false });
        expect(getAccessToken()).toBe('fresh');
    });

    it('ends up logged out, and forgets the hint, when the cookie is no longer valid', async () => {
        setSessionHint(true);
        vi.spyOn(axiosClientModule, 'refreshSession').mockRejectedValue(new Error('401'));
        const store = makeStore();
        await store.dispatch(restoreSession());
        expect(store.getState().auth).toEqual({ token: null, restoring: false });
        expect(hasSessionHint()).toBe(false);
    });
});

describe('logout', () => {
    it('revokes the session on the server and ends it locally', async () => {
        const serverLogout = vi.spyOn(authApi, 'logout').mockResolvedValue({});
        const store = makeStore();
        store.dispatch(startSession('abc'));
        await store.dispatch(logout());
        expect(serverLogout).toHaveBeenCalledTimes(1);
        expect(store.getState().auth.token).toBeNull();
        expect(hasSessionHint()).toBe(false);
    });

    it('ends the session locally even when the server cannot be reached', async () => {
        vi.spyOn(authApi, 'logout').mockRejectedValue(new Error('offline'));
        const store = makeStore();
        store.dispatch(startSession('abc'));
        await expect(store.dispatch(logout())).rejects.toThrow('offline');
        expect(store.getState().auth.token).toBeNull();
        expect(getAccessToken()).toBeNull();
    });
});
