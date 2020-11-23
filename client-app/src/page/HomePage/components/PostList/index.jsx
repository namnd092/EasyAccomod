import React from 'react';
import PropTypes from 'prop-types';
import PostItem from './PostItem';

PostList.propTypes = {
    postList: PropTypes.array,
};
PostList.defaultProp = {
    postList: [],
};

function PostList(props) {
    return (
        <div>
            <h1>PostList</h1>
            {props.postList.map((post, index) => (
                <div key={index}>
                    <PostItem/>
                </div>
            ))}
        </div>
    );
}

export default PostList;