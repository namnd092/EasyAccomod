import React from 'react';
import Rating from '@material-ui/lab/Rating';
import './style.css';
import { useHistory } from 'react-router-dom';

function PostItem(props) {
    const history = useHistory();
    const { postId } = props;
    const handleClickTitle = () => {
        history.push(`/post/${postId}`);
    };
    return (
        <div className="post__item">
            <div className="left">
                <img
                    src="https://res.cloudinary.com/dsysolkex/image/upload/v1605235138/c9m24v6ubivwyo5daf11.jpg"
                    alt=""
                />
            </div>
            <div className="right">
                <h3 className="post__title" onClick={handleClickTitle}>
                    Cho thuê phòng trọ gần chân cầu vượt mễ trì
                </h3>
                <p className="post__description">
                    Vị trí : gần ngay các trục đường chính như Tố Hữu Mễ Trì Đỗ
                    Đức Giục Diện tích: 40m2 có thể chia thành 2 phòng làm việc
                    Khu vực xung quanh thoáng mát trong lành view nhìn ra hồ
                </p>
                <div className="price-rating">
                    <div className="price">
                        <p>4 Triệu/tháng</p>
                    </div>
                    <div className="rating">
                        <Rating
                            name="half-rating-read"
                            defaultValue={3.5}
                            precision={0.5}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="bottom">
                    <div className="bottom-left">
                        <div className="bottom-area">
                            <p style={{ color: 'rgb(151,136,136)' }}>
                                Diện tích:{' '}
                                <span style={{ fontWeight: 'bolder' }}>
                                    40 m2
                                </span>
                            </p>
                        </div>
                        <div className="bottom-position">
                            <p style={{ color: 'rgb(151,136,136)' }}>
                                Khu vực:{' '}
                                <span style={{ fontWeight: 'bolder' }}>
                                    Nam Từ Liêm, Hà Nội
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="bottom-right">
                        <p
                            style={{
                                fontStyle: 'italic',
                                color: 'rgb(151,136,136)',
                            }}
                        >
                            5/12/2020
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
