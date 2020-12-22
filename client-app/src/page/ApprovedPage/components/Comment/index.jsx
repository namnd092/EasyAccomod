import React from 'react';
import Card from '../../../../share/components/card';
import CommentItem from './CommentItem';

const Comment = () => {
    const [commentList, setCommentList] = React.useState([]);
    React.useEffect(() => {
        async function getCommentList() {}
        getCommentList();
    }, []);
    return (
        <div>
            <Card title="Comment đang chờ xác nhận">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">CMTND/CCCD</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">SDT</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commentList.length === 0 ? (
                            <p>Không tìm thấy comment nào</p>
                        ) : (
                            commentList.map((item, index) => (
                                <CommentItem index={index} item={item} />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Comment;
