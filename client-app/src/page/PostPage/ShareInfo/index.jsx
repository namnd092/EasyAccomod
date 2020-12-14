import React from 'react';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { Button, makeStyles } from '@material-ui/core';

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
    const classes = useStyles();
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const handleChangeFavorite = () => {
        //call Api here
        setIsFavorite(!isFavorite);
    };
    return (
        <div class="card mt-2">
            <h5 class="card-header">Chia sẻ</h5>
            <div class="card-body">
                <h5>Lượt xem: 1.1k</h5>
                <h5>Lượt yêu tích: 200</h5>
                <h5>Xếp hạng</h5>
                <Rating
                    name="half-rating-read"
                    defaultValue={3.5}
                    precision={0.5}
                    readOnly={true}
                />
                <Button onClick={handleChangeFavorite}>
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </Button>
                <Button
                    className="btn btn-danger"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    onClick={() => setOpenModal(true)}
                >
                    <ReportProblemIcon /> <span>Report</span>
                </Button>
                <h5>Chia sẻ:</h5>
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
                                Report
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
                        <div class="modal-body">...</div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" class="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareInfo;
