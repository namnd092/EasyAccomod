import React from 'react';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Select from 'react-select';
import SuccessItem from './successItem';
import { useHistory } from 'react-router-dom';

export default function MyPostPage() {
    const history = useHistory();
    const defaultOptions = [{ value: 0, label: 'Tất cả' }];
    const [postListSuccess, setPostListSuccess] = React.useState([]);
    const [postListPending, setPostListPending] = React.useState([]);
    const [statusList, setStatusList] = React.useState(defaultOptions);
    const handleClick = (postId) => {
        history.push(`/post:${postId}`);
    };
    React.useEffect(() => {
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
        getStatusList();
        async function getSuccessList() {
            try {
                const response = await rentalPost.getOwnerRentalPost(1, 15, 2);
                console.log(response);
                setPostListSuccess([...response.ownerSimplePostDtos]);
            } catch (error) {
                console.log(error);
            }
        }
        getSuccessList();
        async function getPendingList() {
            try {
                const response = await rentalPost.getOwnerRentalPost(1, 15, 1);
                console.log(response);
                setPostListPending([...response.ownerSimplePostDtos]);
            } catch (error) {
                console.log(error);
            }
        }
        getPendingList();
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
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Lượt xem</th>
                            <th scope="col">Lượt thích</th>
                            <th scope="col">
                                <Select
                                    options={statusList}
                                    defaultValue={statusList[0]}
                                />
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
                                />
                            ))
                        )}
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
