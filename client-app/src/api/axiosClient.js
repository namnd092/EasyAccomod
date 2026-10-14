import axios from 'axios';
import queryString from 'query-string';
import ApiUrl from '../constants/ApiUrl';
import { getAccessToken, setAccessToken } from './accessToken';

const baseURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL,
    // The refresh token is an HttpOnly cookie that only the account endpoints receive.
    withCredentials: true,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

// Called when a new access token was obtained (to keep the UI state in step) and when the session is over.
let onRefreshed = () => {};
let onUnauthorized = () => {};
export const setSessionHandlers = ({ refreshed, unauthorized }) => {
    if (refreshed) onRefreshed = refreshed;
    if (unauthorized) onUnauthorized = unauthorized;
};

// Asks the API for a new access token using the refresh cookie. Concurrent callers (several requests
// expiring together, StrictMode, two effects) share one call: the server rotates the cookie on every
// refresh, so a second parallel call with the old cookie would look like token theft.
// Tabs share the cookie, so they take turns (Web Locks): the second tab then sends the cookie the first
// one just received instead of the one it replaced. Without Web Locks the tab just goes ahead.
const withRefreshLock = (task) =>
    typeof navigator !== 'undefined' && navigator.locks ? navigator.locks.request('easyaccomod-refresh', task) : task();

let refreshing = null;
export function refreshSession() {
    if (!refreshing) {
        refreshing = withRefreshLock(() => axios.post(`${baseURL}/${ApiUrl.REFRESH}`, null, { withCredentials: true }))
            .then((response) => {
                setAccessToken(response.data.access_token);
                onRefreshed(response.data);
                return response.data;
            })
            .finally(() => {
                refreshing = null;
            });
    }
    return refreshing;
}

axiosClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        // Falsy bodies such as 0 (a post with no views) or false are real values; only an empty body falls back.
        const body = response && response.data;
        if (body !== undefined && body !== null && body !== '') {
            return body;
        }
        return response;
    },
    async (error) => {
        const { config } = error;
        // A 401 without a token is just a failed login, which the login form reports itself.
        if (error.response?.status !== 401 || !config?.headers?.Authorization) {
            throw error;
        }
        // The access token is short-lived: try once to renew it and repeat the request. The repeated request
        // carries `_retried`, so if it is rejected again its own pass through here ends the session.
        if (!config._retried) {
            config._retried = true;
            let renewed;
            try {
                renewed = await refreshSession();
            } catch (refreshError) {
                // Only a rejected refresh cookie ends the session; being offline or a server error does not.
                if (refreshError.response?.status !== 401) throw refreshError;
                onUnauthorized();
                throw error;
            }
            config.headers.Authorization = `Bearer ${renewed.access_token}`;
            return axiosClient.request(config);
        }
        onUnauthorized();
        throw error;
    }
);

export default axiosClient;
