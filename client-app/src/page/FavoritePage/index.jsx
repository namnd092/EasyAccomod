import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import { Button, tableClass } from '../../ui';

export default function FavoritePage() {
    const navigate = useNavigate();
    const [postList, setPostList] = React.useState([]);
    const gotoPost = (postId) => {
        navigate(`/post/${postId}`);
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
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col" style={{ minWidth: '10%' }}>
                                STT
                            </th>
                            <th scope="col">Bài đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length === 0 ? (
                            <tr>
                                <td colSpan={3}>Không tìm thấy bài viết nào</td>
                            </tr>
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
                                        {/* <Button variant="danger"
                                            onClick={() =>
                                                handleDislike(item.id, index)
                                            }
                                        >
                                            <i className="fas fa-heart-broken"></i>{' '}
                                            Bỏ thích
                                        </Button> */}
                                        <Button
                                            onClick={() =>
                                                handleDislike(item.id, index)
                                            }
                                        >
                                            <i className="fas fa-thumbs-down mr-2.5"></i>
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
