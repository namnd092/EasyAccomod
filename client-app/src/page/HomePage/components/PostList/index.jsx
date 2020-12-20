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
            <div className="row">
                <div className="main_list col-12 col-lg-9">
                    {postList.map((item) => (
                        <PostItem key={item.id} rentalPost={item} />
                    ))}
                </div>
                <div className="recommend_list col-12 col-lg-2">
                    <h2>Recommend List</h2>
                </div>
            </div>
        </div>
    );
}

export default PostList;
