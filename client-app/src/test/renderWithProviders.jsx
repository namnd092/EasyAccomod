import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import rootReducer from '../redux/reducer';

// Renders a component with a fresh Redux store and an in-memory router.
export function renderWithProviders(ui, { route = '/', user = {} } = {}) {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState: { user: { role: null, ...user } },
    });
    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
            </Provider>
        ),
    };
}
