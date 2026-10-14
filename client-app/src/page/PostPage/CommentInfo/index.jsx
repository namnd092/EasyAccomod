import React from 'react';
import CommentItem from './CommentItem';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import { Button, FormGroup, Textarea, Rating, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../ui';


function CommentInfo(props) {
    const { postId } = props;
    const renterName = useSelector((state) => state.user.name);
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
            const response = await rentalPost.postComment(params);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setCommentContent('');
            setStarValue(5);
            setIsCommented(true);
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
                console.log(response);
                setCommentList([...response.listCommentDtos]);
            } catch (error) {
                console.log(error);
            }
        }
        getCommentListEffect();
    }, []);
    React.useEffect(() => {
        async function isCommented() {
            try {
                const response = await rentalPost.isCommented(postId);
                console.log(response);
                setIsCommented(response.result);
            } catch (error) {
                console.log(error);
            }
        }
        isCommented();
    }, []);
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
                                commentList.map((item, index) => (
                                    <CommentItem key={index} item={item} />
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
