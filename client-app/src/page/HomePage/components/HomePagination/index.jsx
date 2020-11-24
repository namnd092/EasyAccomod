import React from 'react';
import PropTypes from 'prop-types';
// import Pagination from "react-js-pagination";
import Pagination from '@material-ui/lab/Pagination';

HomePagination.propTypes = {
    activePage: PropTypes.number,
    totalItemsCount: PropTypes.number,
    limit: PropTypes.number,
    onPageChange: PropTypes.func,
};

HomePagination.defaultProp = {
    activePage: 1,
    totalItemsCount: 0,
    limit: 0,
    onPageChange: null,
};

function HomePagination(props) {

    const handlePageChange = (page) => {
        props.onPageChange(page)
    }

    return (
        <div>
            <Pagination
                page={props.activePage}
                showFirstButton={true}
                showLastButton={true}
                // count={Math.ceil(props.totalItemsCount / props.limit)}
                count={10}
                size={"large"}
                onChange={(event, page) => handlePageChange(page)}
            />
        </div>
    );
}

export default HomePagination;