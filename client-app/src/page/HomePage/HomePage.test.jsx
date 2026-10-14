import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from './index';
import rentalPostApi from '../../api/rentalPost';
import addressApi from '../../api/addressApi';
import roomApi from '../../api/roomApi';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('../../api/rentalPost', () => ({ default: { getPostBySearch: vi.fn() } }));
vi.mock('../../api/addressApi', () => ({
    default: {
        getAllProvince: vi.fn(),
        getDistrictByProvinceId: vi.fn(),
        getWardByDistrictID: vi.fn(),
    },
}));
vi.mock('../../api/roomApi', () => ({
    default: {
        getAllRoomAreaType: vi.fn(),
        getAllRoomType: vi.fn(),
        getAllKitchenType: vi.fn(),
    },
}));

const lastQuery = () => new URLSearchParams(rentalPostApi.getPostBySearch.mock.calls.at(-1)[0]);
const searchButton = () => screen.getByRole('button', { name: 'Tìm kiếm' });
const searchButtonReady = () => waitFor(() => expect(searchButton()).toBeEnabled());

beforeEach(() => {
    vi.resetAllMocks();
    rentalPostApi.getPostBySearch.mockResolvedValue({ simplePostDtos: [], maxPage: 3 });
    addressApi.getAllProvince.mockResolvedValue([{ id: 1, name: 'Hà Nội' }]);
    addressApi.getDistrictByProvinceId.mockResolvedValue([{ id: 7, name: 'Cầu Giấy' }]);
    addressApi.getWardByDistrictID.mockResolvedValue([]);
    roomApi.getAllRoomAreaType.mockResolvedValue([]);
    roomApi.getAllRoomType.mockResolvedValue([]);
    roomApi.getAllKitchenType.mockResolvedValue([]);
});

describe('HomePage', () => {
    it('searches with the filters and page found in the URL', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&haveBalcony=1&page=2' });
        await searchButtonReady();
        const query = lastQuery();
        expect(query.get('provinceId')).toBe('1');
        expect(query.get('haveBalcony')).toBe('1');
        expect(query.get('_page')).toBe('2');
    });

    it('searches the first page with no filters for a bare URL', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        const query = lastQuery();
        expect(query.get('provinceId')).toBe('0');
        expect(query.get('_page')).toBe('1');
        expect(query.has('street')).toBe(false);
    });

    it('loads the districts of a province that came from the URL', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&districtId=7' });
        await searchButtonReady();
        await waitFor(() => expect(addressApi.getDistrictByProvinceId).toHaveBeenCalledWith(1));
        expect(await screen.findByText('Cầu Giấy')).toBeInTheDocument();
    });

    it('goes back to the first page when the filters are searched again', async () => {
        renderWithProviders(<HomePage />, { route: '/?haveBalcony=1&page=3' });
        await searchButtonReady();
        await userEvent.click(searchButton());
        await waitFor(() => expect(lastQuery().get('_page')).toBe('1'));
        expect(lastQuery().get('haveBalcony')).toBe('1');
    });

    it('clears every filter', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&haveBalcony=1&page=2' });
        await searchButtonReady();
        expect(screen.getByText('Đang áp dụng 2 bộ lọc')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }));
        await waitFor(() => expect(lastQuery().get('provinceId')).toBe('0'));
        expect(lastQuery().get('haveBalcony')).toBe('0');
        expect(lastQuery().get('_page')).toBe('1');
        expect(screen.queryByRole('button', { name: 'Xóa bộ lọc' })).not.toBeInTheDocument();
    });

    it('offers no way to clear when nothing is filtered', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        expect(screen.queryByRole('button', { name: 'Xóa bộ lọc' })).not.toBeInTheDocument();
    });

    it('falls back to the first page when the URL points past the last page', async () => {
        rentalPostApi.getPostBySearch.mockRejectedValueOnce({ response: { status: 404 } });
        renderWithProviders(<HomePage />, { route: '/?page=9' });
        await waitFor(() => expect(lastQuery().get('_page')).toBe('1'));
        expect(rentalPostApi.getPostBySearch).toHaveBeenCalledTimes(2);
    });
});
