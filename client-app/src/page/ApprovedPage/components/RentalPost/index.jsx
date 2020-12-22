import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import RentalPostItem from './RentalPostItem';
import { useHistory } from 'react-router-dom';
import RentalPostItemReject from './RentalPostItemReject';

const RenterPost = (props) => {
    const history = useHistory();
    const [postListSuccess, setPostListSuccess] = React.useState([]);
    const [postListReject, setPostListReject] = React.useState([]);
    const [postListPending, setPostListPending] = React.useState([]);
    React.useEffect(() => {
        async function getPostListSuccess() {
            try {
                const postListSuccessResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    0
                );
                setPostListSuccess([...postListSuccessResponse.simplePostDtos]);
            } catch (error) {
                console.log(error);
                setPostListSuccess([]);
            }
        }
        getPostListSuccess();
        async function getPostListReject() {
            try {
                const postListRejectResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    3
                );
                setPostListReject([...postListRejectResponse.simplePostDtos]);
            } catch (error) {
                console.log(error);
                setPostListReject([]);
            }
        }
        getPostListReject();
        async function getPostListPending() {
            try {
                const postListPendingResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    1
                );
                setPostListPending([...postListPendingResponse.simplePostDtos]);
            } catch (error) {
                console.log(error);
                setPostListPending([]);
            }
        }
        getPostListPending();
    }, []);
    const handleClickPost = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleConfirm = async (postId, index, type) => {
        try {
            const response = await rentalPost.setStatusRentalPost(1, postId);
            console.log(response);
            if (type === 'pending') {
                setPostListPending([...postListPending].splice(index, 1));
            } else {
                setPostListPending([...postListReject].splice(index, 1));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Card title="Bài đăng đang chờ">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postListPending.length === 0 ? (
                            <p>Không có bài viết nào</p>
                        ) : (
                            postListPending.map((item, index) => (
                                <RentalPostItemReject
                                    key={item.id}
                                    index={index + 1}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                    handleConfirm={() =>
                                        handleConfirm(item.id, index, 'pending')
                                    }
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title="Bài đăng bị từ chối">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postListReject.length === 0 ? (
                            <p>Không có bài viết nào</p>
                        ) : (
                            postListReject.map((item, index) => (
                                <RentalPostItemReject
                                    key={item.id}
                                    index={index + 1}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                    handleConfirm={() =>
                                        handleConfirm(item.id, index, 'reject')
                                    }
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title="Bài đăng đã duyệt">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                            {/* <th scope="col">Hành động</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {postListSuccess.length === 0 ? (
                            <p>Không có bài viết nào</p>
                        ) : (
                            postListSuccess.map((item, index) => (
                                <RentalPostItem
                                    key={item.id}
                                    index={index + 1}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default RenterPost;
