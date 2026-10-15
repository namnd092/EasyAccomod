import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Account from './index';
import authApi from '../../../../api/authApi';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { LocationProbe } from '../../../../test/LocationProbe';

vi.mock('./accountItem', () => ({
    default: ({ account, index, onConfirm, onRefuse }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{account.name}</td>
            <td>
                <button onClick={() => onConfirm(account.accountId)}>Confirm {account.name}</button>
                <button onClick={() => onRefuse(account.accountId)}>Refuse {account.name}</button>
            </td>
        </tr>
    ),
}));
vi.mock('./itemEditRequire', () => ({
    default: ({ account, index, handleCanEdit }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{account.name}</td>
            <td>
                <button onClick={() => handleCanEdit(account.id, true)}>Allow {account.name}</button>
            </td>
        </tr>
    ),
}));
vi.mock('./accountItemSuccess', () => ({
    default: ({ account, index }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{account.name}</td>
        </tr>
    ),
}));

const PENDING_CARD = 'Tài khoản đăng ký đang chờ';
const EDIT_CARD = 'Tài khoản yêu cầu quyền chỉnh sửa';
const CONFIRMED_CARD = 'Tài khoản đã xác nhận';

const owner = (id, name) => ({ id, accountId: `acc-${id}`, name });
const answer = (names, maxPage = 1, firstId = 1) => ({
    owners: names.map((name, i) => owner(firstId + i, name)),
    maxPage,
});
const empty = { owners: [], maxPage: 0 };

// The three lists are answered from `lists`: { pending, edit, confirmed } -> (page) => response.
function mockAccounts({ pending = () => empty, edit = () => empty, confirmed = () => empty } = {}) {
    return {
        pending: vi.spyOn(authApi, 'getOwnerRegisterPending').mockImplementation(async (page) => pending(page)),
        edit: vi.spyOn(authApi, 'getAccountEditRequire').mockImplementation(async (page) => edit(page)),
        confirmed: vi.spyOn(authApi, 'getOwnerSuccess').mockImplementation(async (page) => confirmed(page)),
    };
}

function renderTab(route = '/?tab=accounts') {
    return renderWithProviders(
        <>
            <Account />
            <LocationProbe />
        </>,
        { route }
    );
}

const card = (title) => within(screen.getByRole('heading', { name: title }).parentElement);
const query = () => new URLSearchParams(screen.getByTestId('query').textContent);

afterEach(() => vi.restoreAllMocks());

describe('admin accounts tab', () => {
    it('loads the first page of each list', async () => {
        const get = mockAccounts({
            pending: () => answer(['Pending Ann']),
            edit: () => answer(['Edit Bob'], 1, 2),
            confirmed: () => answer(['Confirmed Cy'], 1, 3),
        });
        renderTab();
        expect(await card(PENDING_CARD).findByText('Pending Ann')).toBeInTheDocument();
        expect(await card(EDIT_CARD).findByText('Edit Bob')).toBeInTheDocument();
        expect(await card(CONFIRMED_CARD).findByText('Confirmed Cy')).toBeInTheDocument();
        expect(get.pending).toHaveBeenCalledWith(1, 15);
        expect(get.edit).toHaveBeenCalledWith(1, 15);
        expect(get.confirmed).toHaveBeenCalledWith(1, 15);
    });

    it('opens the page of each list that the URL asks for', async () => {
        const get = mockAccounts({
            pending: (page) => (page === 2 ? answer(['Pending on 2'], 2, 16) : empty),
            confirmed: (page) => (page === 3 ? answer(['Confirmed on 3'], 3, 31) : empty),
        });
        renderTab('/?tab=accounts&pendingPage=2&confirmedPage=3');
        expect(await screen.findByText('Pending on 2')).toBeInTheDocument();
        expect(await screen.findByText('Confirmed on 3')).toBeInTheDocument();
        expect(get.pending).toHaveBeenCalledWith(2, 15);
        expect(get.edit).toHaveBeenCalledWith(1, 15);
        expect(get.confirmed).toHaveBeenCalledWith(3, 15);
        // Rows are numbered across the pages of their own list.
        expect(card(PENDING_CARD).getByText('16', { selector: 'th' })).toBeInTheDocument();
    });

    it('puts the page of one list in the URL and leaves the others alone', async () => {
        mockAccounts({
            pending: (page) => (page === 2 ? answer(['Pending 2'], 2, 16) : answer(['Pending 1'], 2)),
            confirmed: () => answer(['Confirmed 1'], 1, 40),
        });
        renderTab('/?tab=accounts&confirmedPage=1');
        await screen.findByText('Pending 1');
        await userEvent.click(card(PENDING_CARD).getByRole('button', { name: '2' }));
        expect(await screen.findByText('Pending 2')).toBeInTheDocument();
        expect(query().get('pendingPage')).toBe('2');
        expect(query().get('tab')).toBe('accounts');
        expect(query().has('editPage')).toBe(false);
    });

    it('goes to the last page that exists when the URL asks for one past it', async () => {
        mockAccounts({
            confirmed: (page) => (page === 2 ? answer(['Confirmed 2'], 2, 16) : { owners: [], maxPage: 2 }),
        });
        renderTab('/?tab=accounts&confirmedPage=9');
        expect(await screen.findByText('Confirmed 2')).toBeInTheDocument();
        expect(query().get('confirmedPage')).toBe('2');
    });

    it('moves a confirmed account into the confirmed list by loading both lists again', async () => {
        let confirmed = false;
        const get = mockAccounts({
            pending: () => (confirmed ? empty : answer(['Ann'])),
            confirmed: () => (confirmed ? answer(['Ann'], 1, 1) : empty),
        });
        const setOwner = vi.spyOn(authApi, 'postSetOwner').mockImplementation(async () => {
            confirmed = true;
        });
        renderTab();
        await userEvent.click(await screen.findByRole('button', { name: 'Confirm Ann' }));

        expect(await card(CONFIRMED_CARD).findByText('Ann')).toBeInTheDocument();
        expect(card(PENDING_CARD).queryByText('Ann')).not.toBeInTheDocument();
        expect(setOwner).toHaveBeenCalledWith('acc-1');
        expect(get.pending).toHaveBeenCalledTimes(2);
        expect(get.confirmed).toHaveBeenCalledTimes(2);
    });

    it('loads the pending list again after an account is refused', async () => {
        let refused = false;
        const get = mockAccounts({ pending: () => (refused ? empty : answer(['Ann'])) });
        const refuse = vi.spyOn(authApi, 'postRejectOwner').mockImplementation(async () => {
            refused = true;
        });
        renderTab();
        await userEvent.click(await screen.findByRole('button', { name: 'Refuse Ann' }));
        await waitFor(() => expect(screen.queryByText('Ann')).not.toBeInTheDocument());
        expect(refuse).toHaveBeenCalledWith('acc-1');
        expect(get.pending).toHaveBeenCalledTimes(2);
    });

    it('loads the edit requests again after one is answered', async () => {
        let answered = false;
        const get = mockAccounts({ edit: () => (answered ? empty : answer(['Bob'])) });
        const allow = vi.spyOn(authApi, 'postOwnerCanEditInfo').mockImplementation(async () => {
            answered = true;
        });
        renderTab();
        await userEvent.click(await screen.findByRole('button', { name: 'Allow Bob' }));
        await waitFor(() => expect(screen.queryByText('Bob')).not.toBeInTheDocument());
        expect(allow).toHaveBeenCalledWith(1, true);
        expect(get.edit).toHaveBeenCalledTimes(2);
    });

    it('shows a row saying there is nothing in an empty list', async () => {
        mockAccounts();
        renderTab();
        const messages = await screen.findAllByText('Không tìm thấy tài khoản nào');
        expect(messages).toHaveLength(3);
        messages.forEach((message) => expect(message.closest('tr')).not.toBeNull());
    });
});
