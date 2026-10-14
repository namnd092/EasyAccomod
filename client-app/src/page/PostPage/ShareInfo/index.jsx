import React from 'react';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import { Button, Textarea, Rating, Modal, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../ui';


function ShareInfo(props) {
    const { shareInfo, postId, rate } = props;
    const role = useSelector((state) => state.user.role);
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
            setOpenModal(false);
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
            <div className={`${cardClass} mt-2`}>
                <h5 className={cardHeaderClass}>Chia sẻ</h5>
                <div className={cardBodyClass}>
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
                                value={rate ?? null}
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
                        <div className="flex gap-2.5">
                            <Button onClick={handleChangeFavorite}>
                                <i className={`fas ${isFavorite ? 'fa-thumbs-down' : 'fa-thumbs-up'}`}></i>
                                {isFavorite ? 'Bỏ thích' : 'Thích'}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => setOpenModal(true)}
                                disabled={isReported}
                            >
                                <i className="fas fa-exclamation-triangle"></i> <span>Báo cáo</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    title="Báo cáo"
                    footer={
                        <>
                            <Button variant="neutral" onClick={() => setOpenModal(false)}>
                                Đóng
                            </Button>
                            <Button onClick={handleSubmitReport}>Gửi</Button>
                        </>
                    }
                >
                    <Textarea
                        rows={5}
                        maxLength={1000}
                        placeholder="Viết phản hồi của bạn (tối đa 1000 ký tự)"
                        className={inputClass}
                        onChange={(value) => handleChangeReport(value)}
                    />
                </Modal>
            </div>
        </div>
    );
}

export default ShareInfo;
