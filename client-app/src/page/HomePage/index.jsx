import React from 'react';
import queryString from 'query-string';
import { useSearchParams } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import PostList, { PostListSkeleton } from './components/PostList';
import HomePagination from './components/HomePagination';
import rentalPostApi from '../../api/rentalPost';
import { notifyError } from '../../helper/notify';
import {
    DEFAULT_FILTERS,
    countActiveFilters,
    filtersFromParams,
    filtersToParams,
    pageFromParams,
} from './searchFilters';

const PAGE_SIZE = 15;
const DONG_PER_MILLION = 1_000_000;

// The filters and the page live in the URL, so a refresh, the back button and a shared link keep the search.
export const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [maxPage, setMaxPage] = React.useState(0);
    const [postList, setPostList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const filters = filtersFromParams(searchParams);
    const page = pageFromParams(searchParams);
    const search = searchParams.toString();
    const showFirstPage = React.useEffectEvent((current) => {
        setSearchParams(filtersToParams(current), { replace: true });
    });

    React.useEffect(() => {
        let ignore = false;
        async function searchByFilter() {
            const current = filtersFromParams(new URLSearchParams(search));
            const currentPage = pageFromParams(new URLSearchParams(search));
            const { street, publicLocationNearby, ...rest } = current;
            const query = queryString.stringify({
                ...rest,
                // The URL and the form count prices in millions, the API in dong.
                minPrice: rest.minPrice * DONG_PER_MILLION,
                maxPrice: rest.maxPrice * DONG_PER_MILLION,
                ...(street && { street }),
                ...(publicLocationNearby && { publicLocationNearby }),
                _page: currentPage,
                _limit: PAGE_SIZE,
            });
            try {
                setIsLoading(true);
                const response = await rentalPostApi.getPostBySearch(query);
                if (ignore) return;
                setPostList(response.simplePostDtos);
                setMaxPage(response.maxPage);
            } catch (error) {
                if (ignore) return;
                // The URL points past the last page (a stale link): show the first page instead.
                if (error.response?.status === 404 && currentPage > 1) {
                    showFirstPage(current);
                    return;
                }
                notifyError(error);
                setPostList([]);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }
        searchByFilter();
        return () => {
            ignore = true;
        };
    }, [search]);

    // A new search always starts on the first page.
    const handleFilterChange = (values) => {
        setSearchParams(filtersToParams(values));
    };
    const handlePageChange = (nextPage) => {
        setSearchParams(filtersToParams(filters, nextPage));
    };
    const handleClear = () => {
        setSearchParams(filtersToParams(DEFAULT_FILTERS));
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
