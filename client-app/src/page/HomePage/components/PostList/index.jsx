import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import PostItem from './PostItem';

PostList.propTypes = {
    postList: PropTypes.array,
};
PostList.defaultProp = {
    postList: [],
};

function PostList(props) {
    const { postList } = props;
    return (
        <div className="post_list">
            {/* {props.postList.map((post, index) => (
                <div key={index}>
                    <PostItem/>
                </div>
            ))} */}
            <div className="main_list col-12">
                {postList.map((item) => (
                    <PostItem key={item.id} rentalPost={item} />
                ))}
            </div>
        </div>
    );
}

export default PostList;
