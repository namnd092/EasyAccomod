import React from 'react';
import './style.css';
import { useHistory } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';

export default function FavoritePage() {
    const history = useHistory();
    const [isLike, setIsLike] = React.useState(false);
    const [postList, setPostList] = React.useState([]);
    const gotoPost = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleLike = (postId) => {
        //xoa khoi danh sach
    };
    React.useEffect(() => {
        async function getPostListEffect() {
            try {
                const response = await rentalPost.getAllFavoriteRentalPost();
                console.log(response);
            } catch (error) {
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
                        <tr>
                            <th scope="row" onClick={() => gotoPost(1)}>
                                1
                            </th>
                            <td onClick={() => gotoPost(1)}>
                                Simple title Simple title Simple title Simple
                                title Simple title Simple title
                            </td>
                            <td onClick={() => gotoPost(1)}>Chưa cho thuê</td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => console.log('like')}
                                >
                                    <i class="fas fa-heart"></i> Bỏ thích
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>
                                Simple title Simple title Simple title Simple
                                title Simple title Simple title
                            </td>
                            <td>Chưa cho thuê</td>
                            <td>
                                <button className="btn btn-danger">
                                    <i class="fas fa-heart"></i> Bỏ thích
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>
                                Simple title Simple title Simple title Simple
                                title Simple title Simple title
                            </td>
                            <td>Chưa cho thuê</td>
                            <td>
                                <button className="btn btn-danger">
                                    <i class="fas fa-heart"></i> Bỏ thích
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
