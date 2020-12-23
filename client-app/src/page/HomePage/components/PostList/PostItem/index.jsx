import React from 'react';
import Rating from '@material-ui/lab/Rating';
import './style.css';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

function getDistanceTime(time) {
    const distanceTime = Date.now() - Date.parse(new Date(`${time}`));

    if (distanceTime < 60000)
        return `${Math.floor(distanceTime / 1000)} giây trước`;
    if (distanceTime < 3600000)
        return `${Math.floor(distanceTime / 60000)} phút trước`;
    if (distanceTime < 3600 * 24 * 1000)
        return `${Math.floor(distanceTime / 3600000)} giờ trước`;
    return `${Math.floor(distanceTime / (3600 * 24 * 1000))} ngày trước`;
}

function PostItem(props) {
    const history = useHistory();
    const { rentalPost } = props;
    const {
        id,
        title,
        content,
        pictures,
        dateAdded,
        rate,
        roomArea,
        accommodationPrice,
        accommodationProvince,
    } = rentalPost;
    const handleClickTitle = () => {
        history.push(`/post/${id}`);
    };
    return (
        <div className="post__item">
            <div className="left">
                <div className="numberOfImg">
                    <span>{pictures.length} ảnh</span>
                </div>
                <img
                    src={
                        pictures[Math.floor(Math.random() * pictures.length)]
                            .pictureLink
                    }
                    alt=""
                />
            </div>
            <div className="right">
                <h3 className="post__title" onClick={handleClickTitle}>
                    {title}
                </h3>
                <p className="post__description">{content}</p>
                <div className="price-rating">
                    <div className="price">
                        <p>{accommodationPrice}</p>
                    </div>
                    <div className="rating">
                        <Rating
                            name="half-rating-read"
                            defaultValue={Math.round(rate * 2) / 2}
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
                                    {roomArea}
                                </span>
                            </p>
                        </div>
                        <div className="bottom-position">
                            <p style={{ color: 'rgb(151,136,136)' }}>
                                Khu vực:{' '}
                                <span style={{ fontWeight: 'bolder' }}>
                                    {accommodationProvince}
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
                            {getDistanceTime(dateAdded)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;
