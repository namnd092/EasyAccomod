import React from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import {} from '@material-ui/core';
import BasicInfo from './BasicInfo';
import DescriptionInfo from './DescriptionInfo';
import ImgInfo from './ImgInfo';
import ShareInfo from './ShareInfo';
import CommentInfo from './CommentInfo';
import rentalPost from '../../api/rentalPost';
PostPage.propTypes = {};

function PostPage(props) {
    const { id } = useParams();
    const history = useHistory();
    const [rentalPostInfo, setRentalPostInfo] = React.useState({});
    React.useEffect(() => {
        async function getRentalPostInfoEffect() {
            // try {
            //     const response = await rentalPost.getRentalPostInfo(id);
            //     console.log(response.status);
            //     setRentalPostInfo({ ...response });
            // } catch (error) {
            //     console.log(error);
            // }
            rentalPost
                .getRentalPostInfo(id)
                .then((response) => {
                    console.log(response);
                    setRentalPostInfo({ ...response });
                })
                .catch((error) => {
                    console.log(error);
                    history.push('/notfound');
                });
        }
        getRentalPostInfoEffect();
    }, []);
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
            <ShareInfo shareInfo={{ rate }} postId={id} rate={rate} />
            <CommentInfo postId={id} />
        </div>
    );
}

export default PostPage;
