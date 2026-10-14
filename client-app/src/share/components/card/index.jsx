import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {
    const { children, title } = props;
    return (
        <div className="card">
            <h5 className="card-header" style={{ background: 'pink' }}>
                {title}
            </h5>
            <div className="card-body">{children}</div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
};

export default Card;
