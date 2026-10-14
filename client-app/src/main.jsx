import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { endSession, startSession } from './redux/session';
import { setSessionHandlers } from './api/axiosClient';
import { notify } from './helper/notify';

setSessionHandlers({
    // A silently renewed access token keeps the UI state in step.
    refreshed: ({ access_token }) => store.dispatch(startSession(access_token)),
    // The refresh cookie is gone or revoked: the session is over and the route guards send the user to /login.
    unauthorized: () => {
        if (!store.getState().auth.token) return;
        store.dispatch(endSession());
        notify('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 'error');
    },
});

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
