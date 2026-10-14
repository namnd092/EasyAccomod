import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PostList from './index';
import { renderWithProviders } from '../../../../test/renderWithProviders';

describe('PostList', () => {
    it('says so when the search found nothing', () => {
        renderWithProviders(<PostList postList={[]} />);
        expect(screen.getByText('Không tìm thấy bài đăng nào')).toBeInTheDocument();
    });
});
