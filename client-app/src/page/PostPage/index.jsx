import React from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom'
PostPage.propTypes = {
    
};

function PostPage(props) {
    const {id} = useParams();
    return (
        <div>
            <h2>Bài viết có id là: </h2>{id}
        </div>
    );
}

export default PostPage;