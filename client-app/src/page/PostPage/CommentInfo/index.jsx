import React from 'react';
import Rating from '@mui/material/Rating';
import {
    Button,
    FormGroup,
    Box,
    TextareaAutosize,
} from '@mui/material';
import CommentItem from './CommentItem';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import TelegramIcon from '@mui/icons-material/Telegram';


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
            <div className="card">
                <h5 className="card-header">Bình luận</h5>
                <div className="card-body">
                    <Box sx={{ display: 'flex', flexDirection: 'column', '& > * + *': { marginTop: 1 } }}>
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
                                <div className="row">
                                    <FormGroup className="col-10">
                                        <TextareaAutosize
                                            className="form-control"
                                            minRows="3"
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
                                            variant="contained"
                                            className="btn btn-primary"
                                            color="primary"
                                            type="submit"
                                            disabled={isCommented}
                                        >
                                            Gửi
                                            <TelegramIcon
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </Button>
                                    </FormGroup>
                                </div>
                            </div>
                        </form>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;
