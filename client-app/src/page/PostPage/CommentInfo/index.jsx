import React from 'react';
import Rating from '@material-ui/lab/Rating';
import {
    Button,
    FormGroup,
    makeStyles,
    TextareaAutosize,
} from '@material-ui/core';
import CommentItem from './CommentItem';

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
    const [starValue, setStarValue] = React.useState(5);
    const [commentContent, setCommentContent] = React.useState('');
    const classes = useStyles();
    const _handleChangeStar = (value) => {
        const star = Number(value.target.value);
        setStarValue(star);
    };
    const _handleChangeComment = (value) => {
        setCommentContent(value.target.value);
    };
    const _handleSubmit = (e) => {
        e.preventDefault();
        console.log(starValue, commentContent);
    };
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
                        <FormGroup>
                            <h6>Đánh giá</h6>
                            <Rating
                                name="rating"
                                value={starValue}
                                onChange={(value) => _handleChangeStar(value)}
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
                            >
                                Gửi
                            </Button>
                        </FormGroup>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;
