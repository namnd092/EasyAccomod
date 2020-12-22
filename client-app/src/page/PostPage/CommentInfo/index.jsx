import React from 'react';
import Rating from '@material-ui/lab/Rating';
import {
    Button,
    FormGroup,
    makeStyles,
    TextareaAutosize,
} from '@material-ui/core';
import CommentItem from './CommentItem';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > * + *': {
            marginTop: theme.spacing(1),
        },
    },
}));
function CommentInfo(props) {
    const { postId } = props;
    const role = useSelector((state) => state.user.role);
    const [starValue, setStarValue] = React.useState(5);
    const [commentContent, setCommentContent] = React.useState('');
    const [commentList, setCommentList] = React.useState([]);
    const [isCommented, setIsCommented] = React.useState(false);
    const classes = useStyles();
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
            } catch (error) {
                console.log(error);
            }
        }
        getCommentListEffect();
    }, [commentList]);
    React.useEffect(() => {
        async function isCommented() {
            try {
                const response = await rentalPost.isCommented(postId);
                setIsCommented(response);
            } catch (error) {}
        }
        isCommented();
    }, []);
    return (
        <div class="card mt-2">
            <h5 class="card-header">Bình luận</h5>
            <div class="card-body">
                <div className={classes.root}>
                    <div>
                        <CommentItem />
                        <CommentItem />
                        <CommentItem />
                    </div>
                    <form onSubmit={_handleSubmit}>
                        <div
                            style={{
                                display: isDisplayByRole([Role.RENTER], role),
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
                            <FormGroup>
                                <TextareaAutosize
                                    className="form-control"
                                    rowsMin="3"
                                    placeholder="Viết bình luận của bạn (Tối đa 1000 ký tự)"
                                    maxLength={1000}
                                    onChange={(value) =>
                                        _handleChangeComment(value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    className="btn btn-primary"
                                    color="primary"
                                    type="submit"
                                    disabled={isCommented}
                                >
                                    Gửi
                                </Button>
                            </FormGroup>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;
