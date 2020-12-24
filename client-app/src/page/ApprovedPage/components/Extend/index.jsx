import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ExtendItem from './ExtendItem';
import { useHistory } from 'react-router-dom';

const Extend = () => {
    const history = useHistory();
    const [postList, setPostList] = React.useState([]);
    const handleClick = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleApprove = async (extendId, index) => {
        try {
            const response = await rentalPost.postApproveExtend(extendId);
            console.log(response);
            postList.splice(index, 1);
            setPostList([...postList]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleReject = async (extendId, index) => {
        try {
            const response = await rentalPost.postRejectExtend(extendId);
            console.log(response);
            postList.splice(index, 1);
            setPostList([...postList]);
        } catch (error) {
            console.log(error);
        }
    };
    React.useState(() => {
        async function getPostList() {
            try {
                const response = await rentalPost.getExtendRentalPost(1, 100);
                console.log(response);
                setPostList([...response.listPost]);
            } catch (error) {
                console.log(error);
                setPostList([]);
            }
        }
        getPostList();
    }, []);
    return (
        <div>
            <Card title="Yêu cầu gia hạn bài đăng">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tiêu đề</th>
                            <th scope="col">Tên chủ trọ</th>

                            <th scope="col">Ngày thêm</th>
                            <th scope="col">Số ngày gia hạn</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length === 0 ? (
                            <p>Không tìm thấy bài viết nào</p>
                        ) : (
                            postList.map((item, index) => (
                                <ExtendItem
                                    index={index}
                                    item={item}
                                    handleClick={handleClick}
                                    handleApprove={handleApprove}
                                    handleReject={handleReject}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Extend;
