import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Comment from './index';
import rentalPost from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { LocationProbe } from '../../../../test/LocationProbe';

vi.mock('./CommentItem', () => ({
    default: ({ item, index, handleApprove, handleReject }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{item.content}</td>
            <td>
                <button onClick={() => handleApprove(item.id)}>Approve {item.content}</button>
                <button onClick={() => handleReject(item.id)}>Reject {item.content}</button>
            </td>
        </tr>
    ),
}));

const comment = (id) => ({ id, content: `Comment ${id}` });
const answer = (ids, maxPage = 1) => ({ listCommentDtos: ids.map(comment), maxPage });

function renderTab(route = '/?tab=comments') {
    return renderWithProviders(
        <>
            <Comment />
            <LocationProbe />
        </>,
        { route }
    );
}

const query = () => new URLSearchParams(screen.getByTestId('query').textContent);

afterEach(() => vi.restoreAllMocks());

describe('admin comments tab', () => {
    it('loads the first page of 15 comments', async () => {
        const get = vi.spyOn(rentalPost, 'getCommendPending').mockResolvedValue(answer([1, 2]));
        renderTab();
        expect(await screen.findByText('Comment 1')).toBeInTheDocument();
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(1, 15);
    });

    it('opens the page the URL asks for and numbers the rows across pages', async () => {
        const get = vi
            .spyOn(rentalPost, 'getCommendPending')
            .mockImplementation(async (page) => (page === 2 ? answer([16], 2) : answer([1], 2)));
        renderTab('/?tab=comments&commentPage=2');
        expect(await screen.findByText('Comment 16')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(2, 15);
        expect(screen.getByText('16', { selector: 'th' })).toBeInTheDocument();
    });

    it('puts the page in the URL under its own name and keeps the tab', async () => {
        vi.spyOn(rentalPost, 'getCommendPending').mockImplementation(async (page) =>
            page === 2 ? answer([2], 2) : answer([1], 2)
        );
        renderTab();
        await screen.findByText('Comment 1');
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        expect(await screen.findByText('Comment 2')).toBeInTheDocument();
        expect(query().get('commentPage')).toBe('2');
        expect(query().get('tab')).toBe('comments');
    });

    it('goes to the last page that exists when the URL asks for one past it', async () => {
        vi.spyOn(rentalPost, 'getCommendPending').mockImplementation(async (page) =>
            page === 2 ? answer([16], 2) : { listCommentDtos: [], maxPage: 2 }
        );
        renderTab('/?tab=comments&commentPage=9');
        expect(await screen.findByText('Comment 16')).toBeInTheDocument();
        expect(query().get('commentPage')).toBe('2');
    });

    it('loads the page again after a comment is approved or rejected', async () => {
        let handled = 0;
        const get = vi.spyOn(rentalPost, 'getCommendPending').mockImplementation(async () =>
            handled === 0 ? answer([1, 2, 3]) : answer([2, 3].slice(handled - 1))
        );
        const approve = vi.spyOn(rentalPost, 'postApproveComment').mockImplementation(async () => {
            handled = 1;
        });
        const reject = vi.spyOn(rentalPost, 'postRejectComment').mockImplementation(async () => {
            handled = 2;
        });
        renderTab();
        await screen.findByText('Comment 1');

        await userEvent.click(screen.getByRole('button', { name: 'Approve Comment 1' }));
        await waitFor(() => expect(screen.queryByText('Comment 1')).not.toBeInTheDocument());
        expect(approve).toHaveBeenCalledWith(1);
        expect(get).toHaveBeenCalledTimes(2);

        await userEvent.click(screen.getByRole('button', { name: 'Reject Comment 2' }));
        await waitFor(() => expect(screen.queryByText('Comment 2')).not.toBeInTheDocument());
        expect(reject).toHaveBeenCalledWith(2);
    });

    it('shows a row saying there is nothing when no comment is waiting', async () => {
        vi.spyOn(rentalPost, 'getCommendPending').mockResolvedValue({ listCommentDtos: [], maxPage: 0 });
        renderTab();
        const message = await screen.findByText('Không tìm thấy comment nào');
        expect(message.closest('tr')).not.toBeNull();
    });
});
