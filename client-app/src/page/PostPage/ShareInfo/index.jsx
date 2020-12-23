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
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
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
    const { shareInfo, postId, rate } = props;
    const role = useSelector((state) => state.user.role);
    const classes = useStyles();
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [isReported, setIsReported] = React.useState(false);
    const [numberOfLike, setNumberOfLike] = React.useState(0);
    const [numberOfView, setNumberOfView] = React.useState(0);
    const [openModal, setOpenModal] = React.useState(false);
    const [star, setStar] = React.useState(3.5);
    const [reportContent, setReportContent] = React.useState('');
    const handleChangeFavorite = async () => {
        try {
            if (isFavorite) {
                setNumberOfLike(numberOfLike - 1);
            } else {
                setNumberOfLike(numberOfLike + 1);
            }
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
        } finally {
            setIsReported(true);
        }
    };
    React.useEffect(() => {
        async function isLiked() {
            try {
                const response = await rentalPost.isLiked(postId);
                console.log(response);
                setIsFavorite(response.result);
            } catch (error) {
                console.log(error);
            }
        }
        isLiked();
        async function isReported() {
            try {
                const response = await rentalPost.isReported(postId);
                console.log(response);
                setIsReported(response.result);
            } catch (error) {}
        }
        isReported();
        async function getNumberOfLike() {
            try {
                const response = await rentalPost.getLikes(postId);
                console.log(response);
                setNumberOfLike(Number.isInteger(response) ? response : 0);
            } catch (error) {
                console.log(error);
            }
        }
        getNumberOfLike();
        async function getNumberOfView() {
            try {
                const response = await rentalPost.getViews(postId);
                console.log(response);
                setNumberOfView(response);
            } catch (error) {
                console.log(error);
            }
        }
        getNumberOfView();
        async function getStar() {
            rentalPost
                .getRentalPostInfo(postId)
                .then((response) => {
                    console.log(response);
                    setStar(response.rate);
                })
                .catch((error) => console.log(error));
        }
        getStar();
    }, []);
    return (
        <div className="shareInfo" style={{ marginTop: '30px' }}>
            <div class="card mt-2">
                <h5 class="card-header">Chia sẻ</h5>
                <div class="card-body">
                    <h6>Lượt xem: {numberOfView}</h6>
                    <h6>Lượt thích: {numberOfLike}</h6>
                    <div style={{ display: 'flex' }}>
                        <h6>Xếp hạng:</h6>
                        <div
                            style={{
                                marginLeft: '10px',
                                position: 'relative',
                                bottom: '5px',
                            }}
                        >
                            <Rating
                                name="half-rating-read"
                                defaultValue={star}
                                value={rate}
                                precision={0.5}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: isDisplayByRole([Role.RENTER], role),
                        }}
                    >
                        <div
                            style={{ display: 'flex' }}
                            className="btn-share-info"
                        >
                            <div style={{ marginRight: '10px' }}>
                                {!isFavorite ? (
                                    <Button
                                        onClick={handleChangeFavorite}
                                        className="btn btn-primary"
                                        variant="contained"
                                        color="primary"
                                    >
                                        <ThumbUpAltIcon />
                                        Thích
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleChangeFavorite}
                                        className="btn btn-primary"
                                        variant="contained"
                                        color="primary"
                                    >
                                        <ThumbDownAltIcon />
                                        Bỏ thích
                                    </Button>
                                )}
                            </div>

                            <div>
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
                                <h5
                                    class="modal-title"
                                    id="exampleModalLongTitle"
                                >
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
                                    onChange={(value) =>
                                        handleChangeReport(value)
                                    }
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
        </div>
    );
}

export default ShareInfo;
