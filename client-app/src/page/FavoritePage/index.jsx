import React from 'react';
import './style.css';
import { useHistory } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import FavoriteItem from './FavoriteItem';

export default function FavoritePage() {
    const history = useHistory();
    const [postList, setPostList] = React.useState([]);
    const gotoPost = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleDislike = (postId) => {
        //xoa khoi danh sach
    };
    React.useEffect(() => {
        async function getPostListEffect() {
            try {
                const response = await rentalPost.getAllFavoriteRentalPost();
                console.log(response);
            } catch (error) {
                setPostList([]);
                console.log(error);
            }
        }
        getPostListEffect();
    });
    return (
        <div className="favorite">
            <Card title="Bài đăng yêu thích">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" style={{ minWidth: '10%' }}>
                                Số thứ tự
                            </th>
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length === 0 ? (
                            <p>Không tìm thấy bài viết nào</p>
                        ) : (
                            postList.map((item, index) => (
                                <FavoriteItem key={index} />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
