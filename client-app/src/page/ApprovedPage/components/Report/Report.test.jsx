import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Report from './index';
import rentalPost from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import { LocationProbe } from '../../../../test/LocationProbe';

vi.mock('./ReportItem', () => ({
    default: ({ rentalPost: report, index, handleResolve }) => (
        <tr>
            <th>{index + 1}</th>
            <td>{report.postTitle}</td>
            <td>
                <button onClick={() => handleResolve(report.id)}>Resolve {report.postTitle}</button>
            </td>
        </tr>
    ),
}));

const report = (id) => ({ id, postTitle: `Report ${id}` });
const answer = (ids, maxPage = 1) => ({ reports: ids.map(report), maxPage });

function renderTab(route = '/?tab=reports') {
    return renderWithProviders(
        <>
            <Report />
            <LocationProbe />
        </>,
        { route }
    );
}

const query = () => new URLSearchParams(screen.getByTestId('query').textContent);

afterEach(() => vi.restoreAllMocks());

describe('admin reports tab', () => {
    it('loads the first page of 15 reports', async () => {
        const get = vi.spyOn(rentalPost, 'getReportPost').mockResolvedValue(answer([1, 2]));
        renderTab();
        expect(await screen.findByText('Report 1')).toBeInTheDocument();
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(1, 15);
    });

    it('lists the reports without a React key warning', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(rentalPost, 'getReportPost').mockResolvedValue(answer([1, 2]));
        renderTab();
        expect(await screen.findByText('Report 2')).toBeInTheDocument();
        expect(error.mock.calls.flat().join(' ')).not.toMatch(/unique "key"/);
    });

    it('opens the page the URL asks for and numbers the rows across pages', async () => {
        const get = vi
            .spyOn(rentalPost, 'getReportPost')
            .mockImplementation(async (page) => (page === 2 ? answer([16], 2) : answer([1], 2)));
        renderTab('/?tab=reports&reportPage=2');
        expect(await screen.findByText('Report 16')).toBeInTheDocument();
        expect(get).toHaveBeenCalledWith(2, 15);
        expect(screen.getByText('16', { selector: 'th' })).toBeInTheDocument();
    });

    it('puts the page in the URL under its own name and keeps the tab', async () => {
        vi.spyOn(rentalPost, 'getReportPost').mockImplementation(async (page) =>
            page === 2 ? answer([2], 2) : answer([1], 2)
        );
        renderTab();
        await screen.findByText('Report 1');
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        expect(await screen.findByText('Report 2')).toBeInTheDocument();
        expect(query().get('reportPage')).toBe('2');
        expect(query().get('tab')).toBe('reports');
    });

    it('goes to the last page that exists when the URL asks for one past it', async () => {
        vi.spyOn(rentalPost, 'getReportPost').mockImplementation(async (page) =>
            page === 2 ? answer([16], 2) : { reports: [], maxPage: 2 }
        );
        renderTab('/?tab=reports&reportPage=9');
        expect(await screen.findByText('Report 16')).toBeInTheDocument();
        expect(query().get('reportPage')).toBe('2');
    });

    it('loads the page again after a report is resolved', async () => {
        let resolved = false;
        const get = vi
            .spyOn(rentalPost, 'getReportPost')
            .mockImplementation(async () => (resolved ? answer([2, 3]) : answer([1, 2, 3])));
        const resolve = vi.spyOn(rentalPost, 'postResolveReport').mockImplementation(async () => {
            resolved = true;
        });
        renderTab();
        await screen.findByText('Report 1');

        await userEvent.click(screen.getByRole('button', { name: 'Resolve Report 1' }));
        await waitFor(() => expect(screen.queryByText('Report 1')).not.toBeInTheDocument());
        expect(resolve).toHaveBeenCalledWith(1);
        expect(get).toHaveBeenCalledTimes(2);
    });

    it('shows a row saying there is nothing when no report is waiting', async () => {
        vi.spyOn(rentalPost, 'getReportPost').mockResolvedValue({ reports: [], maxPage: 0 });
        renderTab();
        const message = await screen.findByText('Không có bài viết nào');
        expect(message.closest('tr')).not.toBeNull();
    });
});
