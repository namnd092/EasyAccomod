import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import RentalPostItem from './RentalPostItem';
import { useNavigate } from 'react-router-dom';
import RentalPostItemReject from './RentalPostItemReject';
import RentalPostItemPending from './RentalPostItemPending';
import Select from 'react-select';
import { tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

const defaultOptions = [
    {
        value: 0,
        label: 'Tất cả',
    },
];

const RenterPost = () => {
    const navigate = useNavigate();
    const [options, setOptions] = React.useState(defaultOptions);
    const [optionValue, setOptionValue] = React.useState(0);
    const [postListSuccess, setPostListSuccess] = React.useState([]);
    const [postListReject, setPostListReject] = React.useState([]);
    const [postListPending, setPostListPending] = React.useState([]);
    const [allPost, setAllPost] = React.useState([]);
    React.useEffect(() => {
        async function getAllPost() {
            try {
                const postListSuccessResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    defaultOptions[0].value
                );
                setAllPost([...postListSuccessResponse.simplePostDtos]);
            } catch (error) {
                notifyError(error);
                setAllPost([]);
            }
        }
        getAllPost();
        async function getPostListSuccess() {
            try {
                const postListSuccessResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    // options[2].value || 2
                    2
                );
                setPostListSuccess([...postListSuccessResponse.simplePostDtos]);
            } catch (error) {
                notifyError(error);
                setPostListSuccess([]);
            }
        }
        getPostListSuccess();
        async function getPostListReject() {
            try {
                const postListRejectResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    // options[3].value || 3
                    3
                );
                setPostListReject([...postListRejectResponse.simplePostDtos]);
            } catch (error) {
                notifyError(error);
                setPostListReject([]);
            }
        }
        getPostListReject();
        async function getPostListPending() {
            try {
                const postListPendingResponse = await rentalPost.getRentalPost(
                    1,
                    100,
                    // options[1].value || 1
                    1
                );
                setPostListPending([...postListPendingResponse.simplePostDtos]);
            } catch (error) {
                notifyError(error);
                setPostListPending([]);
            }
        }
        getPostListPending();
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
    const handleOptionChange = (value) => {
        setOptionValue(Number(value.value));
    };
    const handleClickPost = (postId) => {
        navigate(`/post/${postId}`);
    };
    // Moves a post between the lists once the server has accepted the new status.
    const handleResolve = async (postId) => {
        try {
            await rentalPost.setStatusRentalPost(options[2].value, postId);
            const post = postListReject.find((item) => item.id === postId);
            setPostListReject((list) => list.filter((item) => item.id !== postId));
            if (post) setPostListSuccess((list) => [...list, post]);
        } catch (error) {
            notifyError(error);
        }
    };
    const handleConfirm = async (postId) => {
        try {
            await rentalPost.setStatusRentalPost(options[2].value, postId);
            const post = postListPending.find((item) => item.id === postId);
            setPostListPending((list) => list.filter((item) => item.id !== postId));
            if (post) setPostListSuccess((list) => [...list, post]);
        } catch (error) {
            notifyError(error);
        }
    };
    const handleReject = async (postId) => {
        try {
            await rentalPost.setStatusRentalPost(3, postId);
            const post = postListPending.find((item) => item.id === postId);
            setPostListPending((list) => list.filter((item) => item.id !== postId));
            if (post) setPostListReject((list) => [...list, post]);
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div>
            <Card title="Bài đăng">
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
                                    defaultValue={options[0]}
                                    onChange={(value) =>
                                        handleOptionChange(value)
                                    }
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {optionValue === 1 ? (
                            postListPending.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                            ) : (
                                postListPending.map((item, index) => (
                                    <RentalPostItemPending
                                        key={item.id}
                                        index={index}
                                        rentalPost={item}
                                        handleClick={() =>
                                            handleClickPost(item.id)
                                        }
                                        handleConfirm={handleConfirm}
                                        handleReject={handleReject}
                                    />
                                ))
                            )
                        ) : optionValue === 2 ? (
                            postListSuccess.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                            ) : (
                                postListSuccess.map((item, index) => (
                                    <RentalPostItem
                                        key={item.id}
                                        index={index}
                                        rentalPost={item}
                                        handleClick={() =>
                                            handleClickPost(item.id)
                                        }
                                    />
                                ))
                            )
                        ) : optionValue === 3 ? (
                            postListReject.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                            ) : (
                                postListReject.map((item, index) => (
                                    <RentalPostItemReject
                                        key={item.id}
                                        index={index}
                                        rentalPost={item}
                                        handleClick={() =>
                                            handleClickPost(item.id)
                                        }
                                        handleResolve={handleResolve}
                                    />
                                ))
                            )
                        ) : allPost.length === 0 ? (
                            <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                        ) : (
                            allPost.map((item, index) => (
                                <RentalPostItem
                                    key={item.id}
                                    index={index}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            {/* <Card title="Bài đăng bị từ chối">
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postListReject.length === 0 ? (
                            <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                        ) : (
                            postListReject.map((item, index) => (
                                <RentalPostItemReject
                                    key={item.id}
                                    index={index}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                    handleResolve={handleResolve}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title="Bài đăng đã duyệt">
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postListSuccess.length === 0 ? (
                            <tr>
                                    <td colSpan={6}>Không có bài viết nào</td>
                                </tr>
                        ) : (
                            postListSuccess.map((item, index) => (
                                <RentalPostItem
                                    key={item.id}
                                    index={index}
                                    rentalPost={item}
                                    handleClick={() => handleClickPost(item.id)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card> */}
        </div>
    );
};

export default RenterPost;
