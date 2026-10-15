import React from 'react';
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Report from './index';
import rentalPost from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';

vi.mock('./ReportItem', () => ({
    default: ({ rentalPost: report }) => (
        <tr>
            <td>{report.postTitle}</td>
        </tr>
    ),
}));

afterEach(() => vi.restoreAllMocks());

describe('admin reports tab', () => {
    it('shows a row saying there is nothing when no report is waiting', async () => {
        vi.spyOn(rentalPost, 'getReportPost').mockResolvedValue([]);
        renderWithProviders(<Report />);
        const message = await screen.findByText('Không có bài viết nào');
        expect(message.closest('tr')).not.toBeNull();
    });

    it('lists the reports without a React key warning', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(rentalPost, 'getReportPost').mockResolvedValue([
            { id: 1, postTitle: 'Report one' },
            { id: 2, postTitle: 'Report two' },
        ]);
        renderWithProviders(<Report />);
        expect(await screen.findByText('Report two')).toBeInTheDocument();
        expect(error.mock.calls.flat().join(' ')).not.toMatch(/unique "key"/);
    });
});
