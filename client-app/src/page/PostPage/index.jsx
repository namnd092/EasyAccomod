import React from 'react';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfo from './BasicInfo';
import DescriptionInfo from './DescriptionInfo';
import ImgInfo from './ImgInfo';
import ShareInfo from './ShareInfo';
import CommentInfo from './CommentInfo';
import rentalPost from '../../api/rentalPost';
import { notifyError } from '../../helper/notify';
function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rentalPostInfo, setRentalPostInfo] = React.useState({});
    React.useEffect(() => {
        async function getRentalPostInfoEffect() {
            try {
                const response = await rentalPost.getRentalPostInfo(id);
                setRentalPostInfo({ ...response });
            } catch (error) {
                // A missing, expired or unapproved post is the not-found page; anything else is worth saying.
                if (error.response?.status !== 404) notifyError(error);
                navigate('/notfound');
            }
        }
        getRentalPostInfoEffect();
    }, [id, navigate]);
    const {
        accommodation,
        dateAdded,
        dateExpired,
        content,
        rate,
        title,
        owner,
    } = rentalPostInfo;
    return (
        <div className="postPage">
            <BasicInfo
                basicInfo={{
                    accommodation,
                    dateAdded,
                    dateExpired,
                    title,
                    owner,
                }}
            />
            <DescriptionInfo descriptionInfo={content} />
            <ImgInfo imgInfo={rentalPostInfo.accommodationPictures} />
            <ShareInfo postId={id} rate={rate} />
            <CommentInfo postId={id} />
        </div>
    );
}

export default PostPage;
