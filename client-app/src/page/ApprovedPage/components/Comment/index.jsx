import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import CommentItem from './CommentItem';

const Comment = () => {
    const [commentList, setCommentList] = React.useState([]);
    React.useEffect(() => {
        async function getCommentList() {
            try {
                const response = await rentalPost.getCommendPending();
                console.log(response);
                setCommentList([...response]);
            } catch (error) {
                console.log(error);
                setCommentList([]);
            }
        }
        getCommentList();
    }, []);
    const handleApprove = (id) => {
        try {
            const response = rentalPost.postApproveComment(id);
            console.log(response);
            setCommentList([...commentList]);
        } catch (error) {
            console.log(error);
        }
    };
    const handleReject = (id) => {
        try {
            const response = rentalPost.postRejectComment(id);
            console.log(response);
            setCommentList([...commentList]);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Card title="Comment đang chờ xác nhận">
                <table class="table table-hover">
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
