import React from 'react';
import './style.css';
import userImg from '../../../../assets/img/user.png';
import Rating from '@material-ui/lab/Rating';
const CommentItem = () => {
    return (
        <div className="comment__item">
            <div className="left">
                <img src={userImg} alt="" />
            </div>
            <div className="right">
                <h6>Minh Cuong Dong</h6>
                <Rating
                    name="half-rating-read"
                    defaultValue={3.5}
                    precision={0.5}
                    readOnly={true}
                    size="small"
                />
                <p className="content">abcdcj adand cadka cnakda cja</p>
                <p className="time">3 giờ trước</p>
            </div>
        </div>
    );
};

export default CommentItem;
