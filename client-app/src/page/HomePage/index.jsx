import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import './styles.css';
import SearchFrom from './components/SearchFrom';
import PostList from './components/PostList';
import HomePagination from './components/HomePagination';
import rentalPostApi from '../../api/rentalPost';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

export const HomePage = () => {
    const [maxPage, setMaxPage] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('');
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
                if (response.status === 200 || response.status === 201) {
                    console.log(response);
                    setPostList(response.simplePostDtos);
                    setMaxPage(response.maxPage);
                } else {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage(error.message);
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
        <div className="homePage">
            <div className="homepage__searchFrom">
                <SearchFrom
                    onSubmit={handleFilterChange}
                    isLoading={isLoading}
                />
            </div>
            {isLoading ? <LinearProgress /> : <PostList postList={postList} />}
            {!isLoading && (
                <div className="homePage__pagination">
                    <HomePagination
                        onPageChange={handlePageChange}
                        maxPage={maxPage}
                        page={filterSearch._page}
                        activePage={filterSearch._page}
                    />
                </div>
            )}
        </div>
    );
};
