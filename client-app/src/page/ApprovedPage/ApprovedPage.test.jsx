import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ApprovedPage from './index';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('./components/RentalPost', () => ({ default: () => <p>Posts panel</p> }));
vi.mock('./components/Account', () => ({ default: () => <p>Accounts panel</p> }));
vi.mock('./components/Comment', () => ({ default: () => <p>Comments panel</p> }));
vi.mock('./components/Extend', () => ({ default: () => <p>Extend panel</p> }));
vi.mock('./components/Report', () => ({ default: () => <p>Reports panel</p> }));

// Shows the URL query the page ended up with.
function LocationProbe() {
    return <output data-testid="query">{useLocation().search}</output>;
}

function renderPage(route) {
    return renderWithProviders(
        <>
            <ApprovedPage />
            <LocationProbe />
        </>,
        { route }
    );
}

describe('ApprovedPage', () => {
    it('opens the posts tab for a bare URL, leaving the URL clean', () => {
        renderPage('/');
        expect(screen.getByText('Posts panel')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent(/^$/);
    });

    it('opens the tab the URL names', () => {
        renderPage('/?tab=extend');
        expect(screen.getByText('Extend panel')).toBeInTheDocument();
        expect(screen.queryByText('Posts panel')).not.toBeInTheDocument();
    });

    it('falls back to the posts tab for a tab that does not exist', () => {
        renderPage('/?tab=nope');
        expect(screen.getByText('Posts panel')).toBeInTheDocument();
    });

    it('puts the chosen tab in the URL, and none for the first tab', async () => {
        renderPage('/');
        await userEvent.click(screen.getByRole('tab', { name: 'Tài Khoản' }));
        expect(screen.getByText('Accounts panel')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent('?tab=accounts');

        await userEvent.click(screen.getByRole('tab', { name: 'Bài Đăng' }));
        expect(screen.getByText('Posts panel')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent(/^$/);
    });
});
