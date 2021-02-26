import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import RentalPostItem from './RentalPostItem';
import { useHistory } from 'react-router-dom';
import RentalPostItemReject from './RentalPostItemReject';
import RentalPostItemPending from './RentalPostItemPending';
import Select from 'react-select';

const RenterPost = (props) => {
    const history = useHistory();
    const defaultOptions = [
        {
            value: 0,
            label: 'Tất cả',
        },
    ];
    const [options, setOptions] = React.useState(defaultOptions);
    const [optionValue, setOptionValue] = React.useState(0);
    const [postListSuccess, setPostListSuccess] = React.useState([]);
    const [postListReject, setPostListReject] = React.useState([]);
    const [postListPending, setPostListPending] = React.useState([]);
    const [allPost, setAllPost] = React.useState([]);
    React.useEffect(() => {
        getAllPost();
        getPostListSuccess();
        getPostListReject();
        getPostListPending();
        getOptions();
    }, []);
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
            console.log(error);
            setPostListSuccess([]);
        }
    }
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
            console.log(error);
            setPostListReject([]);
        }
    }
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
            console.log(error);
            setPostListPending([]);
        }
    }
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
            console.log(error);
        }
    }
    async function getAllPost() {
        try {
            const postListSuccessResponse = await rentalPost.getRentalPost(
                1,
                100,
                options[0].value
            );
            setAllPost([...postListSuccessResponse.simplePostDtos]);
        } catch (error) {
            console.log(error);
            setAllPost([]);
        }
    }
    const handleOptionChange = (value) => {
        console.log(value.value);
        setOptionValue(Number(value.value));
    };
    const handleClickPost = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleResolve = async (postId, index) => {
        try {
            const response = await rentalPost.setStatusRentalPost(
                options[2].value,
                postId
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setPostListSuccess(
                postListSuccess.concat(postListReject.splice(index, 1))
            );
            setPostListPending([...postListReject]);
        }
    };
    const handleConfirm = async (postId, index) => {
        try {
            const response = await rentalPost.setStatusRentalPost(
                options[2].value,
                postId
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setPostListSuccess(
                postListSuccess.concat(postListPending.splice(index, 1))
            );
            setPostListPending([...postListPending]);
        }
    };
    const handleReject = async (postId, index) => {
        try {
            const response = await rentalPost.setStatusRentalPost(3, postId);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setPostListReject(
                postListReject.concat(postListPending.splice(index, 1))
            );
            setPostListPending([...postListPending]);
        }
    };
    return (
        <div>
            <Card title="Bài đăng">
                <table class="table table-hover">
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
                                <p>Không có bài viết nào</p>
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
                                <p>Không có bài viết nào</p>
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
                                <p>Không có bài viết nào</p>
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
                            <p>Không có bài viết nào</p>
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
                <table class="table table-hover">
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
                            <p>Không có bài viết nào</p>
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
                <table class="table table-hover">
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
                            <p>Không có bài viết nào</p>
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
