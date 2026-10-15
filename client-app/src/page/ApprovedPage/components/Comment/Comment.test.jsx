import React from 'react';
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Comment from './index';
import rentalPost from '../../../../api/rentalPost';
import { renderWithProviders } from '../../../../test/renderWithProviders';

afterEach(() => vi.restoreAllMocks());

describe('admin comments tab', () => {
    it('shows a row saying there is nothing when no comment is waiting', async () => {
        vi.spyOn(rentalPost, 'getCommendPending').mockResolvedValue([]);
        renderWithProviders(<Comment />);
        const message = await screen.findByText('Không tìm thấy comment nào');
        expect(message.closest('tr')).not.toBeNull();
    });
});
