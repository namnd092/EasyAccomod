import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RentalPost from './index';
import rentalPostApi from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { LocationProbe } from '../../../../test/LocationProbe';

vi.mock('./RentalPostItem', () => ({
    default: ({ rentalPost, index }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{rentalPost.title}</td>
        </tr>
    ),
}));
vi.mock('./RentalPostItemPending', () => ({
    default: ({ rentalPost, handleConfirm, handleReject }) => (
        <tr>
            <td>{rentalPost.title}</td>
            <td>
                <button onClick={() => handleConfirm(rentalPost.id)}>Confirm {rentalPost.title}</button>
                <button onClick={() => handleReject(rentalPost.id)}>Reject {rentalPost.title}</button>
            </td>
        </tr>
    ),
}));
vi.mock('./RentalPostItemReject', () => ({
    default: ({ rentalPost, handleResolve }) => (
        <tr>
            <td>{rentalPost.title}</td>
            <td>
                <button onClick={() => handleResolve(rentalPost.id)}>Restore {rentalPost.title}</button>
            </td>
        </tr>
    ),
}));

const PENDING = 1;
const APPROVED = 2;
const REJECTED = 3;
const STATUS_OPTIONS = [
    { id: PENDING, name: 'Chờ duyệt' },
    { id: APPROVED, name: 'Đã duyệt' },
    { id: REJECTED, name: 'Bị từ chối' },
];

const post = (id) => ({ id, title: `Post ${id}` });
const answer = (ids, maxPage = 1) => ({ simplePostDtos: ids.map(post), maxPage });

// Answers each request with the response given for its page: { [page]: response }.
function mockPosts(pages) {
    vi.spyOn(rentalPostApi, 'getStatusOptions').mockResolvedValue(STATUS_OPTIONS);
    return vi
        .spyOn(rentalPostApi, 'getRentalPost')
        .mockImplementation(async (page) => pages[page] ?? { simplePostDtos: [], maxPage: 1 });
}

function renderTab(route = '/?tab=posts') {
    return renderWithProviders(
        <>
            <RentalPost />
            <LocationProbe />
        </>,
        { route }
    );
}

const query = () => new URLSearchParams(screen.getByTestId('query').textContent);

afterEach(() => vi.restoreAllMocks());

describe('admin posts tab', () => {
    it('loads one page of all the posts with a single request', async () => {
        const get = mockPosts({ 1: answer([1, 2]) });
        renderTab();
        expect(await screen.findByText('Post 1')).toBeInTheDocument();
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(1, 15, 0);
    });

    it('opens the status and page the URL asks for', async () => {
        const get = mockPosts({ 2: answer([16], 3) });
        renderTab('/?tab=posts&status=1&page=2');
        expect(await screen.findByText('Post 16')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(2, 15, PENDING);
    });

    it('treats a status it does not know as all the posts', async () => {
        const get = mockPosts({ 1: answer([1]) });
        renderTab('/?tab=posts&status=9');
        await screen.findByText('Post 1');
        expect(get).toHaveBeenCalledWith(1, 15, 0);
    });

    it('numbers the rows across pages', async () => {
        mockPosts({ 2: answer([16, 17], 2) });
        renderTab('/?tab=posts&page=2');
        await screen.findByText('Post 16');
        expect(screen.getByText('16', { selector: 'th' })).toBeInTheDocument();
        expect(screen.getByText('17', { selector: 'th' })).toBeInTheDocument();
    });

    it('puts the page in the URL and keeps the tab', async () => {
        const get = mockPosts({ 1: answer([1], 2), 2: answer([2], 2) });
        renderTab();
        await screen.findByText('Post 1');
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        expect(await screen.findByText('Post 2')).toBeInTheDocument();
        expect(query().get('page')).toBe('2');
        expect(query().get('tab')).toBe('posts');
        expect(get).toHaveBeenLastCalledWith(2, 15, 0);
    });

    it('starts from the first page when another status is chosen', async () => {
        const get = mockPosts({ 1: answer([1]), 3: answer([30], 3) });
        renderTab('/?tab=posts&page=3');
        await screen.findByText('Post 30');
        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByText('Đã duyệt'));
        await waitFor(() => expect(get).toHaveBeenLastCalledWith(1, 15, APPROVED));
        expect(query().get('status')).toBe(String(APPROVED));
        expect(query().has('page')).toBe(false);
        expect(query().get('tab')).toBe('posts');
    });

    it('goes to the last page that exists when the URL asks for one past it', async () => {
        mockPosts({ 9: { simplePostDtos: [], maxPage: 2 }, 2: answer([16], 2) });
        renderTab('/?tab=posts&page=9');
        expect(await screen.findByText('Post 16')).toBeInTheDocument();
        expect(query().get('page')).toBe('2');
    });

    it('loads the page again after a pending post is confirmed, so the next post fills the gap', async () => {
        let confirmed = false;
        const get = vi.spyOn(rentalPostApi, 'getRentalPost').mockImplementation(async () =>
            confirmed ? answer([2, 3]) : answer([1, 2, 3])
        );
        vi.spyOn(rentalPostApi, 'getStatusOptions').mockResolvedValue(STATUS_OPTIONS);
        const set = vi.spyOn(rentalPostApi, 'setStatusRentalPost').mockImplementation(async () => {
            confirmed = true;
        });
        renderTab('/?tab=posts&status=1');
        await screen.findByText('Post 1');

        await userEvent.click(screen.getByRole('button', { name: 'Confirm Post 1' }));
        await waitFor(() => expect(screen.queryByText('Post 1')).not.toBeInTheDocument());
        expect(set).toHaveBeenCalledWith(APPROVED, 1);
        expect(get).toHaveBeenCalledTimes(2);
    });

    it('rejects a pending post and restores a rejected one', async () => {
        const set = vi.spyOn(rentalPostApi, 'setStatusRentalPost').mockResolvedValue(undefined);
        mockPosts({ 1: answer([1]) });
        const { unmount } = renderTab('/?tab=posts&status=1');
        await userEvent.click(await screen.findByRole('button', { name: 'Reject Post 1' }));
        expect(set).toHaveBeenLastCalledWith(REJECTED, 1);
        unmount();

        renderTab('/?tab=posts&status=3');
        await userEvent.click(await screen.findByRole('button', { name: 'Restore Post 1' }));
        expect(set).toHaveBeenLastCalledWith(APPROVED, 1);
    });

    it('shows a row saying there is nothing when a status has no posts', async () => {
        mockPosts({});
        renderTab('/?tab=posts&status=3');
        const row = await screen.findByText('Không có bài viết nào');
        expect(within(screen.getByRole('table')).getByText('Không có bài viết nào')).toBe(row);
        expect(row.closest('tr')).not.toBeNull();
    });
});
