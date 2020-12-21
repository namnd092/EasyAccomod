import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {
    const { children, title } = props;
    return (
        <div class="card">
            <h5 class="card-header">{title}</h5>
            <div class="card-body">{children}</div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
};

export default Card;
