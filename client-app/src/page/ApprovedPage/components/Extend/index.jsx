import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ExtendItem from './ExtendItem';
import { useNavigate } from 'react-router-dom';
import { tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

const Extend = () => {
    const navigate = useNavigate();
    const [postList, setPostList] = React.useState([]);
    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    const removeRequest = (extendId) =>
        setPostList((list) => list.filter((item) => item.extendId !== extendId));
    const handleApprove = async (extendId) => {
        try {
            await rentalPost.postApproveExtend(extendId);
            removeRequest(extendId);
        } catch (error) {
            notifyError(error);
        }
    };
    const handleReject = async (extendId) => {
        try {
            await rentalPost.postRejectExtend(extendId);
            removeRequest(extendId);
        } catch (error) {
            notifyError(error);
        }
    };
    React.useEffect(() => {
        async function getPostList() {
            try {
                const response = await rentalPost.getExtendRentalPost(1, 100);
                setPostList([...response.listPost]);
            } catch (error) {
                notifyError(error);
                setPostList([]);
            }
        }
        getPostList();
    }, []);
    return (
        <div>
            <Card title="Yêu cầu gia hạn bài đăng">
                <table className={tableClass}>
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
