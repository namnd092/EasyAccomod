import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import PostItem from './PostItem';

PostList.propTypes = {
    postList: PropTypes.array,
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
            {postList.length === 0 && <p className="text-center">Không tìm thấy bài đăng nào</p>}
            <div className="main_list col-span-12">
                {postList.map((item) => (
                    <PostItem key={item.id} rentalPost={item} />
                ))}
            </div>
        </div>
    );
}

export default PostList;
