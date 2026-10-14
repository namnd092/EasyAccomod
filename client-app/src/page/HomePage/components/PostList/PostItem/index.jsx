import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from '../../../../../ui';
import { getDistanceTime } from '../../../../../helper/time';

// "3000000đ/Tháng" -> "3.000.000đ/Tháng"; anything that does not start with digits is left alone.
function formatPrice(price) {
    return `${price}`.replace(/^\d+/, (digits) => Number(digits).toLocaleString('vi-VN'));
}

function PostItem(props) {
    const navigate = useNavigate();
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
    const goToPost = () => navigate(`/post/${id}`);
    return (
        <article className="group flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:flex-row">
            <div className="relative aspect-[3/2] w-full shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-100 sm:w-56" onClick={goToPost}>
                {pictures.length > 0 && (
                    <img
                        src={pictures[0].pictureLink}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                    <i className="fas fa-camera mr-1" aria-hidden="true"></i>
                    {pictures.length} ảnh
                </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <h4
                    className="mb-1 line-clamp-2 cursor-pointer text-lg font-medium text-gray-900 group-hover:text-red-600"
                    onClick={goToPost}
                >
                    {title}
                </h4>
                <div className="mb-2 flex flex-wrap items-center gap-x-3">
                    <span className="text-lg font-bold text-red-600">{formatPrice(accommodationPrice)}</span>
                    <Rating value={rate} size="small" />
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-500">{content}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-700">
                    <span>
                        <i className="fas fa-ruler-combined mr-1.5 text-gray-400" aria-hidden="true"></i>
                        Diện tích: <span className="font-semibold">{roomArea}</span>
                    </span>
                    <span>
                        <i className="fas fa-map-marker-alt mr-1.5 text-gray-400" aria-hidden="true"></i>
                        Khu vực: <span className="font-semibold">{accommodationProvince}</span>
                    </span>
                    <span className="text-gray-400 sm:ml-auto">
                        <i className="far fa-clock mr-1.5" aria-hidden="true"></i>
                        {getDistanceTime(dateAdded)}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default PostItem;
