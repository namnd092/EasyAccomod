import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ExtendItem from './ExtendItem';
import { useNavigate } from 'react-router-dom';
import { Pagination, TableScroll, tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { usePagedList } from '../../../../share/hooks/usePagedList';

const PAGE_SIZE = 15;

const Extend = () => {
    const navigate = useNavigate();
    const { items, page, setPage, maxPage, reload } = usePagedList({
        load: async (pageToLoad) => {
            const response = await rentalPost.getExtendRentalPost(pageToLoad, PAGE_SIZE);
            return { items: [...response.listPost], maxPage: response.maxPage };
        },
    });
    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    // Loads the page again so the requests that moved up from the next page fill the gap.
    const answer = (send) => async (extendId) => {
        try {
            await send(extendId);
            reload();
        } catch (error) {
            notifyError(error);
        }
    };
    const handleApprove = answer((extendId) => rentalPost.postApproveExtend(extendId));
    const handleReject = answer((extendId) => rentalPost.postRejectExtend(extendId));
    return (
        <div>
            <Card title="Yêu cầu gia hạn bài đăng">
                <TableScroll>
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
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không tìm thấy bài viết nào</td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <ExtendItem
                                        key={item.extendId}
                                        index={(page - 1) * PAGE_SIZE + index}
                                        item={item}
                                        handleClick={handleClick}
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

export default Extend;
