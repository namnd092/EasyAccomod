import React from 'react';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';

export default function MyPostPage() {
    React.useEffect(() => {
        async function getList() {
            try {
                const response = await rentalPost.getOwnerRentalPost();
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        getList();
    }, []);
    return (
        <div>
            <Card title="Bài đăng đã xác nhận">
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
                            <td>{/* <PostItem /> */}</td>
                            <td>
                                <button className="btn btn-primary">
                                    <i class="fas fa-edit"></i> Đã cho thuê /
                                    Chưa cho thuê
                                </button>
                                <button className="btn btn-primary">
                                    <i class="fas fa-edit"></i> Gia hạn
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>{/* <PostItem /> */}</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>{/* <PostItem /> */}</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Card title="Bài đăng đang chờ xác nhận">
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
                            <td>{/* <PostItem /> */}</td>
                            <td>
                                <button className="btn btn-primary">
                                    <i class="fas fa-edit"></i> Chỉnh sửa
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>{/* <PostItem /> */}</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>{/* <PostItem /> */}</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
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
