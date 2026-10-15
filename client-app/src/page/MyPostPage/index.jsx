import React from 'react';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import SuccessItem from './successItem';
import { useNavigate } from 'react-router-dom';
import PendingItem from './pendingItem';
import { usePagedList } from '../../share/hooks/usePagedList';
import { Pagination, TableScroll, tableClass } from '../../ui';

const PAGE_SIZE = 15;
const STATUS_PENDING = 1;
const STATUS_APPROVED = 2;

// Loads one page of the owner's posts with the given status; the page is kept in the URL under `pageParam`.
function useOwnerPosts(statusId, pageParam) {
    const { items, page, setPage, maxPage } = usePagedList({
        param: pageParam,
        queryKey: statusId,
        load: async (pageToLoad) => {
            const response = await rentalPost.getOwnerRentalPost(pageToLoad, PAGE_SIZE, statusId);
            return { items: [...response.ownerSimplePostDtos], maxPage: response.maxPage };
        },
    });
    return { posts: items, page, setPage, maxPage };
}

export default function MyPostPage() {
    const navigate = useNavigate();
    const approved = useOwnerPosts(STATUS_APPROVED, 'approvedPage');
    const pending = useOwnerPosts(STATUS_PENDING, 'pendingPage');
    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    const handleEditPost = (postId) => {
        navigate(`/post/${postId}/edit`);
    };
    return (
        <div className="myPostPage" style={{ paddingBottom: '30px' }}>
            <div style={{ paddingTop: '30px' }}>
                <Card title="Bài đăng đã xác nhận">
                    <TableScroll>
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ minWidth: '10%' }}>
                                        STT
                                    </th>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Lượt xem</th>
                                    <th scope="col">Lượt thích</th>
                                    <th scope="col" style={{ minWidth: '100px' }}>
                                        Ngày hết hạn
                                    </th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col" style={{ minWidth: '180px' }}>
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {approved.posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8}>Không có bài viết nào</td>
                                    </tr>
                                ) : (
                                    approved.posts.map((item, index) => (
                                        <SuccessItem
                                            index={(approved.page - 1) * PAGE_SIZE + index}
                                            key={item.id}
                                            item={item}
                                            handleClick={handleClick}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TableScroll>
                    <Pagination
                        className="mt-3 justify-center"
                        page={approved.page}
                        count={approved.maxPage}
                        onChange={approved.setPage}
                    />
                </Card>
            </div>
            <div style={{ marginTop: '30px' }}>
                <Card title="Bài đăng đang chờ xác nhận">
                    <TableScroll>
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ minWidth: '10%' }}>
                                        STT
                                    </th>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Ngày hết hạn</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pending.posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}>Không tìm thấy bài viết nào</td>
                                    </tr>
                                ) : (
                                    pending.posts.map((item, index) => (
                                        <PendingItem
                                            index={(pending.page - 1) * PAGE_SIZE + index}
                                            item={item}
                                            key={item.id}
                                            handleClick={handleClick}
                                            handleEditPost={handleEditPost}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TableScroll>
                    <Pagination
                        className="mt-3 justify-center"
                        page={pending.page}
                        count={pending.maxPage}
                        onChange={pending.setPage}
                    />
                </Card>
            </div>
        </div>
    );
}
