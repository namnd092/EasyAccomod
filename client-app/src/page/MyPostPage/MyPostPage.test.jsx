import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MyPostPage from './index';
import rentalPost from '../../api/rentalPost';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('./successItem', () => ({
    default: ({ item }) => (
        <tr>
            <td>{item.title}</td>
        </tr>
    ),
}));
vi.mock('./pendingItem', () => ({
    default: ({ item }) => (
        <tr>
            <td>{item.title}</td>
        </tr>
    ),
}));

const STATUS_PENDING = 1;
const STATUS_APPROVED = 2;

// Shows the URL query the page ended up with.
function LocationProbe() {
    return <output data-testid="query">{useLocation().search}</output>;
}

function renderPage(route) {
    return renderWithProviders(
        <>
            <MyPostPage />
            <LocationProbe />
        </>,
        { route }
    );
}

// Answers each list with the pages given for its status: { [statusId]: { [page]: response } }.
function mockOwnerPosts(pagesByStatus) {
    return vi.spyOn(rentalPost, 'getOwnerRentalPost').mockImplementation(async (page, limit, statusId) => {
        const response = pagesByStatus[statusId]?.[page];
        return response ?? { ownerSimplePostDtos: [], maxPage: 1 };
    });
}

// The pagination under the first table, the approved posts.
const approvedPagination = () => within(screen.getAllByRole('navigation', { name: 'Phân trang' })[0]);

const page = (title, maxPage) => ({ ownerSimplePostDtos: [{ id: title, title }], maxPage });

afterEach(() => vi.restoreAllMocks());

describe('MyPostPage', () => {
    it('opens the page of each list that the URL asks for', async () => {
        const get = mockOwnerPosts({
            [STATUS_APPROVED]: { 2: page('Approved on 2', 3) },
            [STATUS_PENDING]: { 3: page('Pending on 3', 3) },
        });
        renderPage('/?approvedPage=2&pendingPage=3');
        expect(await screen.findByText('Approved on 2')).toBeInTheDocument();
        expect(await screen.findByText('Pending on 3')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(2, 15, STATUS_APPROVED);
        expect(get).toHaveBeenCalledWith(3, 15, STATUS_PENDING);
    });

    it('starts both lists on the first page for a bare URL or a page that is not a number', async () => {
        const get = mockOwnerPosts({});
        renderPage('/?approvedPage=abc');
        await waitFor(() => expect(get).toHaveBeenCalledWith(1, 15, STATUS_APPROVED));
        expect(get).toHaveBeenCalledWith(1, 15, STATUS_PENDING);
    });

    it('puts the page of one list in the URL and leaves the other list alone', async () => {
        mockOwnerPosts({
            [STATUS_APPROVED]: { 1: page('Approved 1', 2), 2: page('Approved 2', 2) },
            [STATUS_PENDING]: { 3: page('Pending 3', 3) },
        });
        renderPage('/?pendingPage=3');
        await screen.findByText('Approved 1');
        await userEvent.click(approvedPagination().getByRole('button', { name: '2' }));
        expect(await screen.findByText('Approved 2')).toBeInTheDocument();
        expect(new URLSearchParams(screen.getByTestId('query').textContent).toString()).toBe(
            'pendingPage=3&approvedPage=2'
        );
        expect(screen.getByText('Pending 3')).toBeInTheDocument();
    });

    it('leaves no page in the URL once a list is back on its first page', async () => {
        mockOwnerPosts({
            [STATUS_APPROVED]: { 1: page('Approved 1', 2), 2: page('Approved 2', 2) },
        });
        renderPage('/?approvedPage=2');
        await screen.findByText('Approved 2');
        await userEvent.click(approvedPagination().getByRole('button', { name: '1' }));
        expect(await screen.findByText('Approved 1')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent(/^$/);
    });

    it('goes to the last page that exists when the URL asks for one past it, and fixes the URL', async () => {
        const get = mockOwnerPosts({
            // The API answers a page past the end with no posts, but still says how many pages there are.
            [STATUS_APPROVED]: { 9: { ownerSimplePostDtos: [], maxPage: 2 }, 2: page('Approved 2', 2) },
        });
        renderPage('/?approvedPage=9');
        expect(await screen.findByText('Approved 2')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent('?approvedPage=2');
        expect(get.mock.calls.filter(([, , status]) => status === STATUS_APPROVED).map(([p]) => p)).toEqual([9, 2]);
    });

    it('goes to the first page when a list that was filled is now empty', async () => {
        mockOwnerPosts({
            [STATUS_APPROVED]: { 4: { ownerSimplePostDtos: [], maxPage: 0 }, 1: page('Approved 1', 1) },
        });
        renderPage('/?approvedPage=4');
        expect(await screen.findByText('Approved 1')).toBeInTheDocument();
        expect(screen.getByTestId('query')).toHaveTextContent(/^$/);
    });
});
