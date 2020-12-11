import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import './styles.css';
import SearchFrom from './components/SearchFrom';
import PostList from './components/PostList';
import HomePagination from './components/HomePagination';

export const HomePage = () => {
    const [totalRow, setTotalRow] = React.useState(0);
    const [postList, setPostList] = React.useState([]);
    const [filterSearch, setFilterSearch] = React.useState({
        province: null,
        district: null,
        ward: null,
        street: null,
        roomPrice: null,
        roomArea: null,
        roomQuantity: null,
        haveKitchen: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: null,
        haveWaterHeater: null,
        waterPrice: null,
        electricityPrice: null,
        liveWithOwner: null,
        _page: 1,
        _limit: 15,
    });
    React.useEffect(() => {
        async function searchByFilter() {
            const query = queryString.stringify(filterSearch);
            console.log(query);
        }
        searchByFilter();
        return () => {};
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
                <SearchFrom onSubmit={handleFilterChange} />
            </div>
            <PostList postList={postList} />
            <div className="homePage__pagination">
                <HomePagination
                    onPageChange={handlePageChange}
                    totalRow={totalRow}
                    page={filterSearch._page}
                />
            </div>
        </div>
    );
};
