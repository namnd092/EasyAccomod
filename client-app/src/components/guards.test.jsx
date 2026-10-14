import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivateRoute from './PrivateRoute';
import AuthRoute from './AuthRoute';
import Role from '../models/data/role';
import { renderWithProviders } from '../test/renderWithProviders';

function Guarded({ roles }) {
    return (
        <Routes>
            <Route
                path="/secret"
                element={
                    <PrivateRoute roles={roles}>
                        <p>secret page</p>
                    </PrivateRoute>
                }
            />
            <Route path="/login" element={<p>login page</p>} />
        </Routes>
    );
}

describe('PrivateRoute', () => {
    it('redirects to /login without a token', () => {
        renderWithProviders(<Guarded roles={[Role.ADMIN]} />, { route: '/secret' });
        expect(screen.getByText('login page')).toBeInTheDocument();
    });

    it('renders the page for an allowed role', () => {
        localStorage.setItem('token', 'x');
        renderWithProviders(<Guarded roles={[Role.ADMIN]} />, {
            route: '/secret',
            user: { role: 'Admin' },
        });
        expect(screen.getByText('secret page')).toBeInTheDocument();
    });

    it('blocks a role that is not allowed', () => {
        localStorage.setItem('token', 'x');
        renderWithProviders(<Guarded roles={[Role.ADMIN]} />, {
            route: '/secret',
            user: { role: 'Renter' },
        });
        expect(screen.queryByText('secret page')).not.toBeInTheDocument();
        expect(screen.queryByText('login page')).not.toBeInTheDocument();
    });

    it('lets an owner who is waiting for confirmation through when that role is allowed', () => {
        localStorage.setItem('token', 'x');
        renderWithProviders(<Guarded roles={[Role.OWNER, Role.OWNER_PENDING]} />, {
            route: '/secret',
            user: { role: 'Wait for Admin to confirm' },
        });
        expect(screen.getByText('secret page')).toBeInTheDocument();
    });
});

describe('AuthRoute', () => {
    function AuthOnly() {
        return (
            <Routes>
                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <p>login form</p>
                        </AuthRoute>
                    }
                />
                <Route path="/" element={<p>home page</p>} />
            </Routes>
        );
    }

    it('shows the login form to visitors', () => {
        renderWithProviders(<AuthOnly />, { route: '/login' });
        expect(screen.getByText('login form')).toBeInTheDocument();
    });

    it('sends a logged-in user home', () => {
        localStorage.setItem('token', 'x');
        renderWithProviders(<AuthOnly />, { route: '/login' });
        expect(screen.getByText('home page')).toBeInTheDocument();
    });
});
