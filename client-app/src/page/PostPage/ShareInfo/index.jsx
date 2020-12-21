import React from 'react';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { Button, makeStyles, TextareaAutosize } from '@material-ui/core';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function ShareInfo(props) {
    const { shareInfo, postId } = props;
    const { rate } = props;
    const role = useSelector((state) => state.user.role);
    const classes = useStyles();
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [isReported, setIsReported] = React.useState(false);
    const [numberOfLike, setNumberOfLike] = React.useState(0);
    const [numberOfView, setNumberOfView] = React.useState(0);
    const [openModal, setOpenModal] = React.useState(false);
    const [reportContent, setReportContent] = React.useState('');
    const handleChangeFavorite = async () => {
        try {
            const response = await rentalPost.postRenterLikeRentalPost(postId);
            console.log(response);
        } catch (error) {}
        setIsFavorite(!isFavorite);
    };
    const handleChangeReport = (value) => {
        setReportContent(value.target.value);
    };
    const handleSubmitReport = async () => {
        console.log(reportContent);
        try {
            const params = {
                AccommodationRentalPostId: Number(postId),
                content: reportContent,
            };
            const response = await rentalPost.postReport(params);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    React.useEffect(() => {
        async function isLiked() {
            try {
                const response = await rentalPost.isLiked(postId);
                setIsFavorite(response.data);
            } catch (error) {}
        }
        isLiked();
        async function isReported() {
            try {
                const response = await rentalPost.isReported(postId);
                setIsReported(response.data);
            } catch (error) {}
        }
        isReported();
        async function getNumberOfLike() {
            try {
                const response = await rentalPost.getLikes(postId);
                setNumberOfLike(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getNumberOfLike();
        async function getNumberOfView() {
            try {
                const response = await rentalPost.getViews(postId);
                setNumberOfView(response);
            } catch (error) {
                console.log(error);
            }
        }
        getNumberOfView();
    }, []);
    return (
        <div class="card mt-2">
            <h5 class="card-header">Chia sẻ</h5>
            <div class="card-body">
                <h5>
                    <VisibilityIcon />
                    Lượt xem: {numberOfView}
                </h5>
                <h5>
                    <ThumbUpAltIcon />
                    Lượt thích: {numberOfLike}
                </h5>
                <h5>Xếp hạng</h5>

                <Rating
                    name="half-rating-read"
                    defaultValue={Math.round(rate * 2) / 2}
                    precision={0.5}
                    readOnly={true}
                />
                <div
                    style={{
                        display: isDisplayByRole([Role.RENTER], role),
                    }}
                >
                    <Button onClick={handleChangeFavorite}>
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </Button>
                    <Button
                        className="btn btn-danger"
                        variant="contained"
                        color="secondary"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                        onClick={() => setOpenModal(true)}
                        disabled={isReported}
                    >
                        <ReportProblemIcon /> <span>Báo cáo</span>
                    </Button>
                </div>
            </div>

            <div
                class="modal fade"
                id="exampleModalCenter"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
            >
                <div
                    class="modal-dialog modal-dialog-centered modal-lg"
                    role="document"
                >
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">
                                Báo cáo
                            </h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <TextareaAutosize
                                rowsMin={5}
                                maxLength={1000}
                                placeholder="Viết phản hồi của bạn (tối đa 1000 ký tự)"
                                className="form-control"
                                onChange={(value) => handleChangeReport(value)}
                            />
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary"
                                onClick={handleSubmitReport}
                                data-dismiss="modal"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareInfo;
