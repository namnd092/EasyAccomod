import { afterEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import axiosClient, { refreshSession, setSessionHandlers } from './axiosClient';
import { getAccessToken, setAccessToken } from './accessToken';

const ok = (config, data) => ({ data, status: 200, statusText: 'OK', headers: {}, config });
const fail = (config, status) =>
    Promise.reject(Object.assign(new Error(`status ${status}`), { config, response: { status, data: '' } }));

// Resolves with the request config the client would send, without hitting the network.
function capture() {
    return axiosClient.get('/x', { adapter: async (config) => ok(config, { config }) }).then((body) => body.config);
}

// Makes the refresh endpoint answer with `outcome` (a token, or an HTTP status to fail with).
function mockRefresh(outcome) {
    return vi.spyOn(axios, 'post').mockImplementation(async () => {
        if (typeof outcome === 'number') throw Object.assign(new Error('refresh failed'), { response: { status: outcome } });
        return { data: { access_token: outcome } };
    });
}

afterEach(() => {
    setAccessToken(null);
    setSessionHandlers({ refreshed: () => {}, unauthorized: () => {} });
    vi.restoreAllMocks();
});

describe('axiosClient', () => {
    it('sends no Authorization header when logged out', async () => {
        expect((await capture()).headers.Authorization).toBeUndefined();
    });

    it('reads the token on every request, so a login takes effect without a reload', async () => {
        await capture();
        setAccessToken('abc');
        expect((await capture()).headers.Authorization).toBe('Bearer abc');
    });

    it('sends cookies, so the refresh cookie reaches the account endpoints', () => {
        expect(axiosClient.defaults.withCredentials).toBe(true);
    });

    it.each([[0], [false]])('returns the body when it is the falsy value %s', async (value) => {
        const body = await axiosClient.get('/x', { adapter: async (config) => ok(config, value) });
        expect(body).toBe(value);
    });
});

describe('axiosClient 401 handling', () => {
    it('ignores a 401 without a token, such as a failed login', async () => {
        const unauthorized = vi.fn();
        setSessionHandlers({ unauthorized });
        const refresh = mockRefresh('new');
        await expect(axiosClient.post('/login', {}, { adapter: (c) => fail(c, 401) })).rejects.toThrow('status 401');
        expect(unauthorized).not.toHaveBeenCalled();
        expect(refresh).not.toHaveBeenCalled();
    });

    it('renews an expired token and repeats the request with the new one', async () => {
        const refreshed = vi.fn();
        setSessionHandlers({ refreshed });
        const refresh = mockRefresh('fresh');
        setAccessToken('expired');
        const seen = [];
        const body = await axiosClient.get('/x', {
            adapter: async (config) => {
                seen.push(config.headers.Authorization);
                return config.headers.Authorization === 'Bearer fresh' ? ok(config, 'data') : fail(config, 401);
            },
        });
        expect(body).toBe('data');
        expect(seen).toEqual(['Bearer expired', 'Bearer fresh']);
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(getAccessToken()).toBe('fresh');
        expect(refreshed).toHaveBeenCalledWith({ access_token: 'fresh' });
    });

    it('shares one refresh between requests that expire together', async () => {
        const refresh = mockRefresh('fresh');
        setAccessToken('expired');
        const adapter = async (config) =>
            config.headers.Authorization === 'Bearer fresh' ? ok(config, 'data') : fail(config, 401);
        const bodies = await Promise.all([
            axiosClient.get('/a', { adapter }),
            axiosClient.get('/b', { adapter }),
            axiosClient.get('/c', { adapter }),
        ]);
        expect(bodies).toEqual(['data', 'data', 'data']);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('ends the session when the refresh is rejected', async () => {
        const unauthorized = vi.fn();
        setSessionHandlers({ unauthorized });
        mockRefresh(401);
        setAccessToken('expired');
        await expect(axiosClient.get('/x', { adapter: (c) => fail(c, 401) })).rejects.toThrow('status 401');
        expect(unauthorized).toHaveBeenCalledTimes(1);
    });

    it('keeps the session when the refresh fails for another reason, such as being offline', async () => {
        const unauthorized = vi.fn();
        setSessionHandlers({ unauthorized });
        mockRefresh(503);
        setAccessToken('expired');
        await expect(axiosClient.get('/x', { adapter: (c) => fail(c, 401) })).rejects.toThrow('refresh failed');
        expect(unauthorized).not.toHaveBeenCalled();
    });

    it('does not renew twice for the same request', async () => {
        const unauthorized = vi.fn();
        setSessionHandlers({ unauthorized });
        const refresh = mockRefresh('fresh');
        setAccessToken('expired');
        // Even the renewed token is rejected (for example the account was disabled).
        await expect(axiosClient.get('/x', { adapter: (c) => fail(c, 401) })).rejects.toThrow('status 401');
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(unauthorized).toHaveBeenCalledTimes(1);
    });
});

describe('refreshSession', () => {
    it('stores the new access token', async () => {
        mockRefresh('fresh');
        await refreshSession();
        expect(getAccessToken()).toBe('fresh');
    });
});
