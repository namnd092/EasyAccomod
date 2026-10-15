import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import RentalPostItem from './RentalPostItem';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RentalPostItemReject from './RentalPostItemReject';
import RentalPostItemPending from './RentalPostItemPending';
import Select from 'react-select';
import { Pagination, TableScroll, tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { usePagedList } from '../../../../share/hooks/usePagedList';

const PAGE_SIZE = 15;
const ALL = 0;
const PENDING = 1;
const APPROVED = 2;
const REJECTED = 3;

const defaultOptions = [
    {
        value: ALL,
        label: 'Tất cả',
    },
];

// The status the URL asks for (?status=2); anything that is not a status shows all the posts.
function statusFromParams(params) {
    const status = Number(params.get('status'));
    return [PENDING, APPROVED, REJECTED].includes(status) ? status : ALL;
}

const RenterPost = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const status = statusFromParams(searchParams);
    const [options, setOptions] = React.useState(defaultOptions);
    React.useEffect(() => {
        async function getOptions() {
            try {
                const response = await rentalPost.getStatusOptions();
                setOptions(
                    defaultOptions.concat(
                        [...response].slice(0, 3).map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            } catch (error) {
                notifyError(error);
            }
        }
        getOptions();
    }, []);
    const { items, page, setPage, maxPage, reload } = usePagedList({
        queryKey: status,
        load: async (pageToLoad) => {
            const response = await rentalPost.getRentalPost(pageToLoad, PAGE_SIZE, status);
            return { items: [...response.simplePostDtos], maxPage: response.maxPage };
        },
    });
    // Another status starts again from the first page; the other parameters of the URL (the tab) stay.
    const handleOptionChange = ({ value }) =>
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (value === ALL) next.delete('status');
            else next.set('status', String(value));
            next.delete('page');
            return next;
        });
    const handleClickPost = (postId) => {
        navigate(`/post/${postId}`);
    };
    // Loads the page again so the posts that moved up from the next page fill the gap.
    const setStatus = (statusId) => async (postId) => {
        try {
            await rentalPost.setStatusRentalPost(statusId, postId);
            reload();
        } catch (error) {
            notifyError(error);
        }
    };
    const handleConfirm = setStatus(APPROVED);
    const handleReject = setStatus(REJECTED);
    const handleResolve = setStatus(APPROVED);
    const renderRow = (item, index) => {
        const props = {
            index: (page - 1) * PAGE_SIZE + index,
            rentalPost: item,
            handleClick: () => handleClickPost(item.id),
        };
        if (status === PENDING)
            return (
                <RentalPostItemPending
                    key={item.id}
                    {...props}
                    handleConfirm={handleConfirm}
                    handleReject={handleReject}
                />
            );
        if (status === REJECTED)
            return <RentalPostItemReject key={item.id} {...props} handleResolve={handleResolve} />;
        return <RentalPostItem key={item.id} {...props} />;
    };
    return (
        <div>
            <Card title="Bài đăng">
                <TableScroll>
                    <table className={tableClass}>
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên bài đăng</th>
                                <th scope="col">Người đăng</th>
                                <th scope="col">Email</th>
                                <th scope="col">Ngày đăng</th>
                                <th scope="col" style={{ minWidth: '200px' }}>
                                    <Select
                                        options={options}
                                        value={options.find((option) => option.value === status) ?? null}
                                        onChange={handleOptionChange}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                            ) : (
                                items.map(renderRow)
                            )}
                        </tbody>
                    </table>
                </TableScroll>
                <Pagination className="mt-3 justify-center" page={page} count={maxPage} onChange={setPage} />
            </Card>
        </div>
    );
};

export default RenterPost;
