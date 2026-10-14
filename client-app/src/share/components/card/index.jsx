import React from 'react';
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

export default Card;
