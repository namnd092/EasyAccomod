import React from 'react';
import './style.css';
import userImg from '../../../../assets/img/user.png';
import { getDistanceTime } from '../../../../helper/time';
import { Rating } from '../../../../ui';

const CommentItem = (props) => {
    const { item } = props;
    return (
        <div className="comment__item">
            <div className="left">
                <img src={userImg} alt="" />
            </div>
            <div className="right">
                <h6>{item.renterName}</h6>
                <Rating
                    name="half-rating-read"
                    value={Math.round(item.rate * 2) / 2}
                    precision={0.5}
                    readOnly={true}
                    size="small"
                />
                <p className="content">{item && item.content}</p>
                <p className="time">{item && getDistanceTime(item.time)}</p>
            </div>
        </div>
    );
};

export default CommentItem;
