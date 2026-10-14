import React from 'react';
import { Pagination } from '../../../../ui';
// import Pagination from "react-js-pagination";

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
