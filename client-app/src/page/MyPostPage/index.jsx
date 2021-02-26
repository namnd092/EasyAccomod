import React from 'react';
import './style.css';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import SuccessItem from './successItem';
import { useHistory } from 'react-router-dom';
import PendingItem from './pendingItem';

export default function MyPostPage() {
    const history = useHistory();
    const defaultOptions = [{ value: 0, label: 'Tất cả' }];
    const [postListSuccess, setPostListSuccess] = React.useState([]);
    const [postListPending, setPostListPending] = React.useState([]);
    const [statusList, setStatusList] = React.useState(defaultOptions);
    React.useEffect(() => {
        getStatusList();
        getSuccessList();
        getPendingList();
    }, []);
    const handleClick = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleEditPost = (postId) => {
        history.push(`post/${postId}/edit`);
    };
    async function getStatusList() {
        try {
            const response = await rentalPost.getStatusOptions();
            setStatusList(
                defaultOptions.concat(
                    [...response].slice(0, 2).map((e) => ({
                        value: e.id,
                        label: e.name,
                    }))
                )
            );
        } catch (error) {
            console.log(error);
        }
    }
    async function getSuccessList() {
        try {
            const response = await rentalPost.getOwnerRentalPost(1, 15, 2);
            console.log(response);
            setPostListSuccess([...response.ownerSimplePostDtos]);
        } catch (error) {
            console.log(error);
        }
    }
    async function getPendingList() {
        try {
            const response = await rentalPost.getOwnerRentalPost(1, 15, 1);
            console.log(response);
            setPostListPending([...response.ownerSimplePostDtos]);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="myPostPage" style={{ paddingBottom: '30px' }}>
            <div style={{ paddingTop: '30px' }}>
                <Card title="Bài đăng đã xác nhận">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col" style={{ minWidth: '10%' }}>
                                    STT
                                </th>
                                <th scope="col">Tiêu đề</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Lượt xem</th>
                                <th scope="col">Lượt thích</th>
                                <th scope="col" style={{ minWidth: '100px' }}>
                                    Ngày hết hạn
                                </th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col" style={{ minWidth: '180px' }}>
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {postListSuccess.length === 0 ? (
                                <p>Không có bài viết nào</p>
                            ) : (
                                postListSuccess.map((item, index) => (
                                    <SuccessItem
                                        index={index}
                                        key={index}
                                        item={item}
                                        handleClick={handleClick}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
            <div style={{ marginTop: '30px' }}>
                <Card title="Bài đăng đang chờ xác nhận">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col" style={{ minWidth: '10%' }}>
                                    STT
                                </th>
                                <th scope="col">Tiêu đề</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Ngày hết hạn</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postListPending.length === 0 ? (
                                <p>Không tìm thấy bài viết nào</p>
                            ) : (
                                postListPending.map((item, index) => (
                                    <PendingItem
                                        index={index}
                                        item={item}
                                        key={index}
                                        handleClick={handleClick}
                                        handleEditPost={handleEditPost}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
            {/* <Card title="Bài đăng đã bị từ chối">
                <table class="table">
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
                        <tr>
                            <th scope="row">1</th>
                            <td></td>
                            <td>
                                <button className="btn btn-danger">
                                    <i class="fas fa-trash-alt"></i> Xóa
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td></td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td></td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card> */}
        </div>
    );
}
