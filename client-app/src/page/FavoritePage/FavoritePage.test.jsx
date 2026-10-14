import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FavoritePage from './index';
import rentalPost from '../../api/rentalPost';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('../HomePage/components/PostList/PostItem', () => ({
    default: ({ rentalPost: post }) => <span>{post.title}</span>,
}));

const posts = (from, to) =>
    Array.from({ length: to - from + 1 }, (_, i) => ({ id: from + i, title: `Post ${from + i}` }));

// Shows the URL query the page ended up with.
function LocationProbe() {
    return <output data-testid="query">{useLocation().search}</output>;
}

beforeEach(() => {
    window.scrollTo = vi.fn();
});
afterEach(() => vi.restoreAllMocks());

describe('FavoritePage', () => {
    it('shows the first page and loads the next one on request, numbering rows across pages', async () => {
        const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(async (page) =>
            page === 1 ? { simplePostDtos: posts(1, 15), maxPage: 2 } : { simplePostDtos: posts(16, 17), maxPage: 2 }
        );
        renderWithProviders(<FavoritePage />);
        expect(await screen.findByText('Post 1')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(1, 15);

        await userEvent.click(screen.getByRole('button', { name: '2' }));
        expect(await screen.findByText('Post 16')).toBeInTheDocument();
        expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
        expect(screen.getByText('16', { selector: 'th' })).toBeInTheDocument();
    });

    it('refetches the page after removing a post so the next page fills the gap', async () => {
        let removed = false;
        vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(async () => ({
            simplePostDtos: removed ? posts(2, 3) : posts(1, 3),
            maxPage: 1,
        }));
        vi.spyOn(rentalPost, 'postRenterLikeRentalPost').mockImplementation(async () => {
            removed = true;
        });
        renderWithProviders(<FavoritePage />);
        await screen.findByText('Post 1');

        await userEvent.click(screen.getAllByRole('button', { name: /Bỏ thích/ })[0]);
        await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeInTheDocument());
        expect(screen.getByText('Post 2')).toBeInTheDocument();
    });

    it('steps back a page when the current one no longer exists', async () => {
        // Page 2 vanished (its last post was unliked elsewhere) after the list said there were two pages.
        const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(async (page) => {
            if (page === 2) throw Object.assign(new Error('not found'), { response: { status: 404 } });
            return { simplePostDtos: posts(1, 15), maxPage: 2 };
        });
        renderWithProviders(<FavoritePage />);
        await screen.findByText('Post 1');

        await userEvent.click(screen.getByRole('button', { name: '2' }));
        // Page 1 is asked for how many pages are left, then shown.
        await waitFor(() => expect(get).toHaveBeenCalledTimes(4));
        expect(get.mock.calls.map(([page]) => page)).toEqual([1, 2, 1, 1]);
        expect(await screen.findByText('Post 1')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    describe('with the page in the URL', () => {
        const twoPages = async (page) =>
            page === 1 ? { simplePostDtos: posts(1, 15), maxPage: 2 } : { simplePostDtos: posts(16, 17), maxPage: 2 };
        const renderAt = (route) =>
            renderWithProviders(
                <>
                    <FavoritePage />
                    <LocationProbe />
                </>,
                { route }
            );

        it('opens the page the URL asks for', async () => {
            const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(twoPages);
            renderAt('/favorite?page=2');
            expect(await screen.findByText('Post 16')).toBeInTheDocument();
            expect(get).toHaveBeenCalledTimes(1);
            expect(get).toHaveBeenCalledWith(2, 15);
        });

        it('treats a page that is not a number as the first page', async () => {
            const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(twoPages);
            renderAt('/favorite?page=abc');
            expect(await screen.findByText('Post 1')).toBeInTheDocument();
            expect(get).toHaveBeenCalledWith(1, 15);
        });

        it('puts the page in the URL and scrolls to the top when the page changes', async () => {
            vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(twoPages);
            renderAt('/favorite');
            await screen.findByText('Post 1');
            expect(screen.getByTestId('query')).toHaveTextContent('');
            expect(window.scrollTo).not.toHaveBeenCalled();

            await userEvent.click(screen.getByRole('button', { name: '2' }));
            expect(await screen.findByText('Post 16')).toBeInTheDocument();
            expect(screen.getByTestId('query')).toHaveTextContent('?page=2');
            expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));

            // The first page has a clean URL again.
            await userEvent.click(screen.getByRole('button', { name: '1' }));
            expect(await screen.findByText('Post 1')).toBeInTheDocument();
            expect(screen.getByTestId('query')).toHaveTextContent('');
        });

        const onlyTwoPagesExist = async (page) => {
            if (page > 2) throw Object.assign(new Error('not found'), { response: { status: 404 } });
            return twoPages(page);
        };

        it('goes to the last page that exists when the URL is one past it, and fixes the URL', async () => {
            const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(onlyTwoPagesExist);
            renderAt('/favorite?page=3');
            expect(await screen.findByText('Post 16')).toBeInTheDocument();
            expect(get.mock.calls.map(([page]) => page)).toEqual([3, 1, 2]);
            expect(screen.getByTestId('query')).toHaveTextContent('?page=2');
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('needs only one extra request for a page far past the end', async () => {
            const get = vi.spyOn(rentalPost, 'getAllFavoriteRentalPost').mockImplementation(onlyTwoPagesExist);
            renderAt('/favorite?page=9999');
            expect(await screen.findByText('Post 16')).toBeInTheDocument();
            expect(get.mock.calls.map(([page]) => page)).toEqual([9999, 1, 2]);
            expect(screen.getByTestId('query')).toHaveTextContent('?page=2');
        });
    });
});
