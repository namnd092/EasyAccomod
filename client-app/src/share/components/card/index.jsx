import React from 'react';
import PropTypes from 'prop-types';
import { cardClass, cardHeaderClass, cardBodyClass } from '../../../ui';

const Card = (props) => {
    const { children, title } = props;
    return (
        <div className={cardClass}>
            <h5 className={cardHeaderClass}>{title}</h5>
            <div className={cardBodyClass}>{children}</div>
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
};

export default Card;
