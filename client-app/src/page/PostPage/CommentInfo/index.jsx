import React from 'react';
import CommentItem from './CommentItem';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import { Button, FormGroup, Textarea, Rating, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../ui';
import { notifyError, notifySuccess } from '../../../helper/notify';

function CommentInfo(props) {
    const { postId } = props;
    const role = useSelector((state) => state.user.role);
    const [starValue, setStarValue] = React.useState(5);
    const [commentContent, setCommentContent] = React.useState('');
    const [commentList, setCommentList] = React.useState([]);
    const [isCommented, setIsCommented] = React.useState(false);
    const _handleChangeStar = (value) => {
        const star = Number(value.target.value);
        setStarValue(star);
    };
    const _handleChangeComment = (value) => {
        setCommentContent(value.target.value);
    };
    const _handleSubmit = async (e) => {
        e.preventDefault();
        const params = {
            AccommodationRentalPostId: postId,
            rate: starValue,
            content: commentContent,
        };
        try {
            await rentalPost.postComment(params);
            setCommentContent('');
            setStarValue(5);
            setIsCommented(true);
            notifySuccess('Đã gửi bình luận, đang chờ quản trị viên duyệt');
        } catch (error) {
            notifyError(error);
        }
    };
    React.useEffect(() => {
        async function getCommentListEffect() {
            try {
                const response = await rentalPost.getAllCommentByPostId(
                    postId,
                    10,
                    1
                );
                setCommentList([...response.listCommentDtos]);
            } catch (error) {
                notifyError(error);
            }
        }
        getCommentListEffect();
    }, [postId]);
    const isRenter = role?.toLowerCase() === Role.RENTER;
    React.useEffect(() => {
        if (!isRenter) return;
        async function isCommented() {
            try {
                const response = await rentalPost.isCommented(postId);
                setIsCommented(response.result);
            } catch (error) {
                notifyError(error);
            }
        }
        isCommented();
    }, [postId, isRenter]);
    return (
        <div style={{ marginTop: '30px' }}>
            <div className={cardClass}>
                <h5 className={cardHeaderClass}>Bình luận</h5>
                <div className={cardBodyClass}>
                    <div className="flex flex-col gap-2">
                        <div>
                            {commentList.length === 0 ? (
                                <p>Chưa có bình luận nào</p>
                            ) : (
                                commentList.map((item) => (
                                    <CommentItem key={item.id} item={item} />
                                ))
                            )}
                        </div>
                        <form onSubmit={_handleSubmit}>
                            <div
                                style={{
                                    display: isDisplayByRole(
                                        [Role.RENTER],
                                        role
                                    ),
                                }}
                            >
                                <FormGroup>
                                    <h6>Đánh giá</h6>
                                    <Rating
                                        name="rating"
                                        value={starValue}
                                        onChange={(value) =>
                                            _handleChangeStar(value)
                                        }
                                        size="large"
                                    />
                                </FormGroup>
                                <div className="grid grid-cols-12 gap-x-4">
                                    <FormGroup className="col-span-10">
                                        <Textarea
                                            className={inputClass}
                                            rows={3}
                                            placeholder="Viết bình luận của bạn (Tối đa 1000 ký tự)"
                                            maxLength={1000}
                                            value={commentContent}
                                            onChange={(value) =>
                                                _handleChangeComment(value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button
                                            type="submit"
                                            disabled={isCommented}
                                        >
                                            Gửi
                                            <i className="fas fa-paper-plane ml-2.5"></i>
                                        </Button>
                                    </FormGroup>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;
