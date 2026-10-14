import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import { Button, tableClass } from '../../ui';
import { notifyError } from '../../helper/notify';

export default function FavoritePage() {
    const navigate = useNavigate();
    const [postList, setPostList] = React.useState([]);
    const gotoPost = (postId) => {
        navigate(`/post/${postId}`);
    };
    const handleDislike = async (postId) => {
        try {
            await rentalPost.postRenterLikeRentalPost(postId);
            setPostList((list) => list.filter((e) => e.id !== postId));
        } catch (error) {
            notifyError(error);
        }
    };
    React.useEffect(() => {
        async function getPostListEffect() {
            try {
                const response = await rentalPost.getAllFavoriteRentalPost();
                setPostList([...response.simplePostDtos]);
            } catch (error) {
                setPostList([]);
                notifyError(error);
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
                                <tr key={item.id}>
                                    <th onClick={() => gotoPost(item.id)}>
                                        {index + 1}
                                    </th>
                                    <td onClick={() => gotoPost(item.id)}>
                                        <PostItem rentalPost={item} />
                                    </td>
                                    <td>
                                        <Button onClick={() => handleDislike(item.id)}>
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
