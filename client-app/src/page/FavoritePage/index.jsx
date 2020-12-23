import React from 'react';
import './style.css';
import { useHistory } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import { Button } from '@material-ui/core';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';

export default function FavoritePage() {
    const history = useHistory();
    const [postList, setPostList] = React.useState([]);
    const gotoPost = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleDislike = async (postId) => {
        try {
            const response = await rentalPost.postRenterLikeRentalPost(postId);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            if (postList.length === 1) {
                setPostList([]);
            } else {
                const index = postList.findIndex((e) => e.id === postId);
                postList.splice(index, 1);
                console.log(postList);
                setPostList([...postList]);
            }
        }
    };
    React.useEffect(() => {
        async function getPostListEffect() {
            try {
                const response = await rentalPost.getAllFavoriteRentalPost();
                console.log(response);
                setPostList([...response.simplePostDtos]);
            } catch (error) {
                setPostList([]);
                console.log(error);
            }
        }
        getPostListEffect();
    }, []);
    return (
        <div className="favorite">
            <Card title="Bài đăng yêu thích">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" style={{ minWidth: '10%' }}>
                                Số thứ tự
                            </th>
                            <th scope="col">Bài đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length === 0 ? (
                            <p>Không tìm thấy bài viết nào</p>
                        ) : (
                            postList.map((item, index) => (
                                // <FavoriteItem key={index} item={item}/>
                                <tr>
                                    <th onClick={() => gotoPost(item.id)}>
                                        {index + 1}
                                    </th>
                                    <td onClick={() => gotoPost(item.id)}>
                                        <PostItem
                                            rentalPost={item}
                                            key={index}
                                        />
                                    </td>
                                    <td>
                                        {/* <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDislike(item.id, index)
                                            }
                                        >
                                            <i class="fas fa-heart-broken"></i>{' '}
                                            Bỏ thích
                                        </button> */}
                                        <Button
                                            onClick={() =>
                                                handleDislike(item.id, index)
                                            }
                                            className="btn btn-primary"
                                            variant="contained"
                                            color="primary"
                                        >
                                            <ThumbDownAltIcon
                                                style={{ marginRight: '10px' }}
                                            />
                                            Bỏ thích
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
