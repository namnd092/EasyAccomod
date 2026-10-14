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
        getAllPaymentType: vi.fn(),
    },
}));

const lastQuery = () => new URLSearchParams(rentalPostApi.getPostBySearch.mock.calls.at(-1)[0]);
const searchButton = () => screen.getByRole('button', { name: 'Tìm kiếm' });
const searchButtonReady = () => waitFor(() => expect(searchButton()).toBeEnabled());

beforeEach(() => {
    vi.resetAllMocks();
    rentalPostApi.getPostBySearch.mockResolvedValue({ simplePostDtos: [], maxPage: 3, totalCount: 42 });
    addressApi.getAllProvince.mockResolvedValue([{ id: 1, name: 'Hà Nội' }]);
    addressApi.getDistrictByProvinceId.mockResolvedValue([{ id: 7, name: 'Cầu Giấy' }]);
    addressApi.getWardByDistrictID.mockResolvedValue([]);
    roomApi.getAllRoomAreaType.mockResolvedValue([]);
    roomApi.getAllRoomType.mockResolvedValue([]);
    roomApi.getAllKitchenType.mockResolvedValue([]);
    roomApi.getAllPaymentType.mockResolvedValue([
        { id: 1, name: 'Tháng' },
        { id: 2, name: 'Quý' },
    ]);
    window.scrollTo = vi.fn();
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

    it('sends the price range to the API in dong although the URL keeps it in millions', async () => {
        renderWithProviders(<HomePage />, { route: '/?minPrice=3&maxPrice=5' });
        await searchButtonReady();
        expect(lastQuery().get('minPrice')).toBe('3000000');
        expect(lastQuery().get('maxPrice')).toBe('5000000');
    });

    it('sends no price bounds for an unfiltered search', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        expect(lastQuery().get('minPrice')).toBe('0');
        expect(lastQuery().get('maxPrice')).toBe('0');
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

    it('says how many posts matched', async () => {
        renderWithProviders(<HomePage />);
        expect(await screen.findByText('42 kết quả')).toBeInTheDocument();
    });

    it('shows no count when nothing matched', async () => {
        rentalPostApi.getPostBySearch.mockResolvedValue({ simplePostDtos: [], maxPage: 0, totalCount: 0 });
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        expect(screen.queryByText(/kết quả/)).not.toBeInTheDocument();
    });

    it('sorts by the order in the URL, and sends none by default', async () => {
        renderWithProviders(<HomePage />, { route: '/?sort=priceAsc' });
        await searchButtonReady();
        expect(lastQuery().get('sortBy')).toBe('priceAsc');
        expect(screen.getByLabelText('Sắp xếp')).toHaveValue('priceAsc');
    });

    it('sends no sort order for a bare URL', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        expect(lastQuery().has('sortBy')).toBe(false);
    });

    it('changes the sort order and starts again from the first page', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&page=2' });
        await searchButtonReady();
        await userEvent.selectOptions(await screen.findByLabelText('Sắp xếp'), 'priceDesc');
        await waitFor(() => expect(lastQuery().get('sortBy')).toBe('priceDesc'));
        expect(lastQuery().get('_page')).toBe('1');
        expect(lastQuery().get('provinceId')).toBe('1');
    });

    it('keeps the sort order when the filters are searched or cleared', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&sort=newest' });
        await searchButtonReady();
        await userEvent.click(searchButton());
        await waitFor(() => expect(lastQuery().get('sortBy')).toBe('newest'));
        await userEvent.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }));
        await waitFor(() => expect(lastQuery().get('provinceId')).toBe('0'));
        expect(lastQuery().get('sortBy')).toBe('newest');
    });

    it('applies a price chip at once and keeps the other filters', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1&page=2' });
        await searchButtonReady();
        await userEvent.click(screen.getByRole('button', { name: 'Dưới 1 triệu' }));
        await waitFor(() => expect(lastQuery().get('maxPrice')).toBe('1000000'));
        expect(lastQuery().get('minPrice')).toBe('0');
        expect(lastQuery().get('provinceId')).toBe('1');
        expect(lastQuery().get('_page')).toBe('1');
        expect(screen.getByRole('button', { name: 'Dưới 1 triệu' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('takes the price filter off when the chosen chip is pressed again', async () => {
        renderWithProviders(<HomePage />, { route: '/?minPrice=1&maxPrice=2' });
        await searchButtonReady();
        const chip = screen.getByRole('button', { name: '1 triệu - 2 triệu' });
        expect(chip).toHaveAttribute('aria-pressed', 'true');
        await userEvent.click(chip);
        await waitFor(() => expect(lastQuery().get('maxPrice')).toBe('0'));
        expect(lastQuery().get('minPrice')).toBe('0');
        expect(screen.getByRole('button', { name: '1 triệu - 2 triệu' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('filters by the payment type that was chosen', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        await userEvent.click(screen.getByRole('button', { name: 'Tìm kiếm cơ bản' }));
        await userEvent.click(screen.getByLabelText('Hình thức thanh toán'));
        await userEvent.click(await screen.findByText('Quý'));
        await userEvent.click(searchButton());
        await waitFor(() => expect(lastQuery().get('paymentTypeId')).toBe('2'));
    });

    it('shows the payment type that came from the URL', async () => {
        renderWithProviders(<HomePage />, { route: '/?paymentTypeId=2' });
        await searchButtonReady();
        expect(await screen.findByText('Quý')).toBeInTheDocument();
        expect(lastQuery().get('paymentTypeId')).toBe('2');
    });

    it('scrolls back to the top when the page changes', async () => {
        renderWithProviders(<HomePage />);
        await searchButtonReady();
        await userEvent.click(screen.getByRole('button', { name: '2' }));
        await waitFor(() => expect(lastQuery().get('_page')).toBe('2'));
        expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    });

    it('does not scroll when the page is first shown', async () => {
        renderWithProviders(<HomePage />, { route: '/?page=2' });
        await searchButtonReady();
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('searches again when the same filters are searched once more', async () => {
        renderWithProviders(<HomePage />, { route: '/?provinceId=1' });
        await searchButtonReady();
        const before = rentalPostApi.getPostBySearch.mock.calls.length;
        await userEvent.click(searchButton());
        await waitFor(() => expect(rentalPostApi.getPostBySearch.mock.calls.length).toBe(before + 1));
    });
});
