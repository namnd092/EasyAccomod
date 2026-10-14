import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import SearchFrom from './components/SearchFrom';
import PostList, { PostListSkeleton } from './components/PostList';
import HomePagination from './components/HomePagination';
import rentalPostApi from '../../api/rentalPost';

export const HomePage = () => {
    const [maxPage, setMaxPage] = React.useState(0);
    const [postList, setPostList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [filterSearch, setFilterSearch] = React.useState({
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        street: '',
        publicLocationNearby: '',
        accommodationTypeId: 0,
        paymentTypeId: 0,
        minPrice: 0,
        maxPrice: 0,
        roomAreaRangeId: 0,
        kitchenTypeId: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: 0,
        haveWaterHeater: 0,
        liveWithOwner: 0,
        _page: 1,
        _limit: 15,
    });
    React.useEffect(() => {
        async function searchByFilter() {
            const { street, publicLocationNearby } = filterSearch;
            let newFilterSearch = { ...filterSearch };
            if (!street) {
                delete newFilterSearch.street;
            }
            if (!publicLocationNearby) {
                delete newFilterSearch.publicLocationNearby;
            }
            const query = queryString.stringify(newFilterSearch);
            try {
                setIsLoading(true);
                const response = await rentalPostApi.getPostBySearch(query);
                console.log(response);
                setPostList(response.simplePostDtos);
                setMaxPage(response.maxPage);
            } catch (error) {
                console.log(error);
                setPostList([]);
            } finally {
                setIsLoading(false);
            }
        }
        searchByFilter();
    }, [filterSearch]);
    const handleFilterChange = (value) => {
        setFilterSearch({ ...filterSearch, ...value });
    };
    const handlePageChange = (_page) => {
        setFilterSearch({ ...filterSearch, _page });
    };
    return (
        <div className="py-6">
            <section className="rounded-lg bg-white p-5 shadow-sm">
                <h1 className="mb-4 text-2xl font-semibold">Tìm phòng trọ</h1>
                <SearchFrom
                    onSubmit={handleFilterChange}
                    isLoading={isLoading}
                />
            </section>
            {isLoading ? <PostListSkeleton /> : <PostList postList={postList} />}
            {!isLoading && maxPage > 0 && (
                <HomePagination
                    onPageChange={handlePageChange}
                    maxPage={maxPage}
                    activePage={filterSearch._page}
                />
            )}
        </div>
    );
};
