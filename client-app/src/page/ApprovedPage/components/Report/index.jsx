import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ReportItem from './ReportItem';
import { useNavigate } from 'react-router-dom';
import { Pagination, TableScroll, tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { usePagedList } from '../../../../share/hooks/usePagedList';

const PAGE_SIZE = 15;

const Report = () => {
    const navigate = useNavigate();
    const { items, page, setPage, maxPage, reload } = usePagedList({
        param: 'reportPage',
        load: async (pageToLoad) => {
            const response = await rentalPost.getReportPost(pageToLoad, PAGE_SIZE);
            return { items: [...response.reports], maxPage: response.maxPage };
        },
    });
    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    // Loads the page again so the reports that moved up from the next page fill the gap.
    const handleResolve = async (id) => {
        try {
            await rentalPost.postResolveReport(id);
            reload();
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div>
            <Card title="Phản hồi về bài đăng">
                <TableScroll>
                    <table className={tableClass}>
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên bài đăng</th>
                                <th scope="col">Người đăng</th>
                                <th scope="col">Nội dung</th>
                                <th scope="col">Thời gian</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                            ) : (
                                items.map((item, index) => (
                                    <ReportItem
                                        key={item.id}
                                        index={(page - 1) * PAGE_SIZE + index}
                                        rentalPost={item}
                                        handleClick={handleClick}
                                        handleResolve={handleResolve}
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

export default Report;
