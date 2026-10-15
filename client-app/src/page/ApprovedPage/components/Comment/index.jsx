import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import CommentItem from './CommentItem';
import { Pagination, TableScroll, tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { usePagedList } from '../../../../share/hooks/usePagedList';

const PAGE_SIZE = 15;

const Comment = () => {
    const { items, page, setPage, maxPage, reload } = usePagedList({
        param: 'commentPage',
        load: async (pageToLoad) => {
            const response = await rentalPost.getCommendPending(pageToLoad, PAGE_SIZE);
            return { items: [...response.listCommentDtos], maxPage: response.maxPage };
        },
    });
    // Loads the page again so the comments that moved up from the next page fill the gap.
    const answer = (send) => async (id) => {
        try {
            await send(id);
            reload();
        } catch (error) {
            notifyError(error);
        }
    };
    const handleApprove = answer((id) => rentalPost.postApproveComment(id));
    const handleReject = answer((id) => rentalPost.postRejectComment(id));
    return (
        <div>
            <Card title="Bình luận đang chờ xác nhận">
                <TableScroll>
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
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không tìm thấy comment nào</td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <CommentItem
                                        key={item.id}
                                        index={(page - 1) * PAGE_SIZE + index}
                                        item={item}
                                        handleApprove={handleApprove}
                                        handleReject={handleReject}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </TableScroll>
                <Pagination className="mt-3 justify-center" page={page} count={maxPage} onChange={setPage} />
            </Card>
        </div>
    );
};

export default Comment;
