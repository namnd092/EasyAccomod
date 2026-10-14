import React from 'react';
import queryString from 'query-string';
import { useLocation, useSearchParams } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import PostList, { PostListSkeleton } from './components/PostList';
import HomePagination from './components/HomePagination';
import ResultsToolbar from './components/ResultsToolbar';
import rentalPostApi from '../../api/rentalPost';
import { notifyError } from '../../helper/notify';
import {
    DEFAULT_FILTERS,
    countActiveFilters,
    filtersFromParams,
    filtersToParams,
    pageFromParams,
    sortFromParams,
    withPriceRange,
} from './searchFilters';

const PAGE_SIZE = 15;
const DONG_PER_MILLION = 1_000_000;

// The filters and the page live in the URL, so a refresh, the back button and a shared link keep the search.
export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Every navigation gets a new key, even to the same URL, so searching again reloads the results.
    const { key: navigationKey } = useLocation();
    const [maxPage, setMaxPage] = React.useState(0);
    const [totalCount, setTotalCount] = React.useState(0);
    const [postList, setPostList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const filters = filtersFromParams(searchParams);
    const page = pageFromParams(searchParams);
    const sort = sortFromParams(searchParams);
    const search = searchParams.toString();
    const showFirstPage = React.useEffectEvent((current, currentSort) => {
        setSearchParams(filtersToParams(current, 1, currentSort), { replace: true });
    });

    React.useEffect(() => {
        let ignore = false;
        async function searchByFilter() {
            const current = filtersFromParams(new URLSearchParams(search));
            const currentPage = pageFromParams(new URLSearchParams(search));
            const currentSort = sortFromParams(new URLSearchParams(search));
            const { street, publicLocationNearby, ...rest } = current;
            const query = queryString.stringify({
                ...rest,
                // The URL and the form count prices in millions, the API in dong.
                minPrice: rest.minPrice * DONG_PER_MILLION,
                maxPrice: rest.maxPrice * DONG_PER_MILLION,
                ...(street && { street }),
                ...(publicLocationNearby && { publicLocationNearby }),
                ...(currentSort && { sortBy: currentSort }),
                _page: currentPage,
                _limit: PAGE_SIZE,
            });
            try {
                setIsLoading(true);
                const response = await rentalPostApi.getPostBySearch(query);
                if (ignore) return;
                setPostList(response.simplePostDtos);
                setMaxPage(response.maxPage);
                setTotalCount(response.totalCount);
            } catch (error) {
                if (ignore) return;
                // The URL points past the last page (a stale link): show the first page instead.
                if (error.response?.status === 404 && currentPage > 1) {
                    showFirstPage(current, currentSort);
                    return;
                }
                notifyError(error);
                setPostList([]);
                setTotalCount(0);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }
        searchByFilter();
        return () => {
            ignore = true;
        };
    }, [search, navigationKey]);

    // A new search or sort order always starts on the first page; the sort order outlives the filters.
    const handleFilterChange = (values) => {
        setSearchParams(filtersToParams(values, 1, sort));
    };
    const handlePageChange = (nextPage) => {
        setSearchParams(filtersToParams(filters, nextPage, sort));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleClear = () => {
        setSearchParams(filtersToParams(DEFAULT_FILTERS, 1, sort));
    };
    const handlePriceChange = (rangeValue) => {
        handleFilterChange(withPriceRange(filters, rangeValue));
    };
    const handleSortChange = (nextSort) => {
        setSearchParams(filtersToParams(filters, 1, nextSort));
    };
    return (
        <div className="py-6">
            <section className="rounded-lg bg-white p-5 shadow-sm">
                <h1 className="mb-4 text-2xl font-semibold">Tìm phòng trọ</h1>
                <SearchForm
                    filters={filters}
                    activeCount={countActiveFilters(filters)}
                    onSubmit={handleFilterChange}
                    onClear={handleClear}
                    isLoading={isLoading}
                />
            </section>
            <ResultsToolbar
                filters={filters}
                sort={sort}
                totalCount={totalCount}
                isLoading={isLoading}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
            />
            {isLoading ? <PostListSkeleton /> : <PostList postList={postList} />}
            {!isLoading && maxPage > 0 && (
                <HomePagination
                    onPageChange={handlePageChange}
                    maxPage={maxPage}
                    activePage={page}
                />
            )}
        </div>
    );
};
