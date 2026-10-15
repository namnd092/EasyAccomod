import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Extend from './index';
import rentalPost from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { LocationProbe } from '../../../../test/LocationProbe';

vi.mock('./ExtendItem', () => ({
    default: ({ item, index, handleApprove, handleReject }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{item.title}</td>
            <td>
                <button onClick={() => handleApprove(item.extendId)}>Approve {item.title}</button>
                <button onClick={() => handleReject(item.extendId)}>Reject {item.title}</button>
            </td>
        </tr>
    ),
}));

const request = (id) => ({ id, extendId: id * 10, title: `Request ${id}` });
const answer = (ids, maxPage = 1) => ({ listPost: ids.map(request), maxPage });

function renderTab(route = '/?tab=extend') {
    return renderWithProviders(
        <>
            <Extend />
            <LocationProbe />
        </>,
        { route }
    );
}

const query = () => new URLSearchParams(screen.getByTestId('query').textContent);

afterEach(() => vi.restoreAllMocks());

describe('admin extend tab', () => {
    it('loads the first page of 15 requests', async () => {
        const get = vi.spyOn(rentalPost, 'getExtendRentalPost').mockResolvedValue(answer([1, 2]));
        renderTab();
        expect(await screen.findByText('Request 1')).toBeInTheDocument();
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(1, 15);
    });

    it('opens the page the URL asks for and numbers the rows across pages', async () => {
        const get = vi
            .spyOn(rentalPost, 'getExtendRentalPost')
            .mockImplementation(async (page) => (page === 2 ? answer([16], 2) : answer([1], 2)));
        renderTab('/?tab=extend&page=2');
        expect(await screen.findByText('Request 16')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(2, 15);
        expect(screen.getByText('16', { selector: 'th' })).toBeInTheDocument();
    });

    it('puts the page in the URL and keeps the tab', async () => {
        vi.spyOn(rentalPost, 'getExtendRentalPost').mockImplementation(async (page) =>
            page === 2 ? answer([2], 2) : answer([1], 2)
        );
        renderTab();
        await screen.findByText('Request 1');
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        expect(await screen.findByText('Request 2')).toBeInTheDocument();
        expect(query().get('page')).toBe('2');
        expect(query().get('tab')).toBe('extend');
    });

    it('goes to the last page that exists when the URL asks for one past it', async () => {
        vi.spyOn(rentalPost, 'getExtendRentalPost').mockImplementation(async (page) =>
            page === 2 ? answer([16], 2) : { listPost: [], maxPage: 2 }
        );
        renderTab('/?tab=extend&page=9');
        expect(await screen.findByText('Request 16')).toBeInTheDocument();
        expect(query().get('page')).toBe('2');
    });

    it('loads the page again after a request is approved or rejected', async () => {
        let handled = 0;
        const get = vi.spyOn(rentalPost, 'getExtendRentalPost').mockImplementation(async () =>
            handled === 0 ? answer([1, 2, 3]) : answer([2, 3].slice(handled - 1))
        );
        const approve = vi.spyOn(rentalPost, 'postApproveExtend').mockImplementation(async () => {
            handled = 1;
        });
        const reject = vi.spyOn(rentalPost, 'postRejectExtend').mockImplementation(async () => {
            handled = 2;
        });
        renderTab();
        await screen.findByText('Request 1');

        await userEvent.click(screen.getByRole('button', { name: 'Approve Request 1' }));
        await waitFor(() => expect(screen.queryByText('Request 1')).not.toBeInTheDocument());
        expect(approve).toHaveBeenCalledWith(10);
        expect(get).toHaveBeenCalledTimes(2);

        await userEvent.click(screen.getByRole('button', { name: 'Reject Request 2' }));
        await waitFor(() => expect(screen.queryByText('Request 2')).not.toBeInTheDocument());
        expect(reject).toHaveBeenCalledWith(20);
    });

    it('shows a row saying there is nothing when there are no requests', async () => {
        vi.spyOn(rentalPost, 'getExtendRentalPost').mockResolvedValue({ listPost: [], maxPage: 0 });
        renderTab();
        const message = await screen.findByText('Không tìm thấy bài viết nào');
        expect(message.closest('tr')).not.toBeNull();
    });
});
