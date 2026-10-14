import { afterEach, describe, expect, it } from 'vitest';
import axiosClient from './axiosClient';

// Resolves with the request config the client would send, without hitting the network.
function capture() {
    return axiosClient
        .get('/x', { adapter: async (config) => ({ data: { config }, status: 200, statusText: 'OK', headers: {}, config }) })
        .then((body) => body.config);
}

afterEach(() => localStorage.clear());

describe('axiosClient', () => {
    it('sends no Authorization header when logged out', async () => {
        expect((await capture()).headers.Authorization).toBeUndefined();
    });

    it('reads the token on every request, so a login takes effect without a reload', async () => {
        await capture();
        localStorage.setItem('token', 'abc');
        expect((await capture()).headers.Authorization).toBe('Bearer abc');
    });
});
