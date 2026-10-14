import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '../../../../ui';
// import Pagination from "react-js-pagination";

HomePagination.propTypes = {
    activePage: PropTypes.number,
    totalItemsCount: PropTypes.number,
    limit: PropTypes.number,
    onPageChange: PropTypes.func,
};

function HomePagination(props) {
    const { maxPage, activePage } = props;

    return (
        <div className="mt-5 flex justify-center">
            <Pagination
                page={activePage}
                count={maxPage}
                onChange={props.onPageChange}
            />
        </div>
    );
}

export default HomePagination;
