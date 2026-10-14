import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import CommentItem from './CommentItem';
import { tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

const Comment = () => {
    const [commentList, setCommentList] = React.useState([]);
    React.useEffect(() => {
        async function getCommentList() {
            try {
                const response = await rentalPost.getCommendPending();
                setCommentList([...response]);
            } catch (error) {
                notifyError(error);
                setCommentList([]);
            }
        }
        getCommentList();
    }, []);
    const handleApprove = async (id) => {
        try {
            await rentalPost.postApproveComment(id);
            setCommentList((list) => list.filter((comment) => comment.id !== id));
        } catch (error) {
            notifyError(error);
        }
    };
    const handleReject = async (id) => {
        try {
            await rentalPost.postRejectComment(id);
            setCommentList((list) => list.filter((comment) => comment.id !== id));
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div>
            <Card title="Bình luận đang chờ xác nhận">
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Đánh giá</th>
                            <th scope="col">Nội dụng</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commentList.length === 0 ? (
                            <p>Không tìm thấy comment nào</p>
                        ) : (
                            commentList.map((item, index) => (
                                <CommentItem
                                    key={item.id}
                                    index={index}
                                    item={item}
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

export default Comment;
