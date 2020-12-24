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
    const { maxPage, activePage } = props;

    const handlePageChange = (page) => {
        props.onPageChange(page);
    };

    return (
        <div style={{ display: 'flex', marginTop: '20px' }}>
            <Pagination
                page={activePage}
                showFirstButton={true}
                showLastButton={true}
                count={maxPage}
                size={'large'}
                onChange={(event, page) => handlePageChange(page)}
                style={{ margin: 'auto' }}
            />
        </div>
    );
}

export default HomePagination;
