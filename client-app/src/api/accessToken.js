// The access token lives in memory only, so a script injected into the page cannot read it from
// storage. A reload loses it; the refresh cookie (HttpOnly, set by the API) restores the session.
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
    accessToken = token;
};

// A non-secret flag saying "this browser logged in before", so a first-time visitor does not make a
// pointless refresh request on every page load. It grants nothing: the cookie is what authenticates.
const HINT_KEY = 'hasSession';

export function hasSessionHint() {
    try {
        return localStorage.getItem(HINT_KEY) === '1';
    } catch {
        return false;
    }
}

export function setSessionHint(present) {
    try {
        if (present) localStorage.setItem(HINT_KEY, '1');
        else localStorage.removeItem(HINT_KEY);
    } catch {
        // Storage can be blocked; the session then simply does not survive a reload.
    }
}
