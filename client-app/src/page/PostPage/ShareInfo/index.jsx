import React from 'react';
import rentalPost from '../../../api/rentalPost';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../helper/auth';
import Role from '../../../models/data/role';
import { Button, Textarea, Rating, Modal, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../ui';
import { notifyError, notifySuccess } from '../../../helper/notify';

function ShareInfo(props) {
    const { postId, rate } = props;
    const role = useSelector((state) => state.user.role);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [isReported, setIsReported] = React.useState(false);
    const [numberOfLike, setNumberOfLike] = React.useState(0);
    const [numberOfView, setNumberOfView] = React.useState(0);
    const [openModal, setOpenModal] = React.useState(false);
    const [reportContent, setReportContent] = React.useState('');
    const handleChangeFavorite = async () => {
        try {
            await rentalPost.postRenterLikeRentalPost(postId);
            setNumberOfLike(numberOfLike + (isFavorite ? -1 : 1));
            setIsFavorite(!isFavorite);
        } catch (error) {
            notifyError(error);
        }
    };
    const handleChangeReport = (value) => {
        setReportContent(value.target.value);
    };
    const handleSubmitReport = async () => {
        try {
            const params = {
                AccommodationRentalPostId: Number(postId),
                content: reportContent,
            };
            await rentalPost.postReport(params);
            setIsReported(true);
            setOpenModal(false);
            notifySuccess('Đã gửi báo cáo');
        } catch (error) {
            notifyError(error);
        }
    };
    const isRenter = role?.toLowerCase() === Role.RENTER;
    // Only a renter can like or report, and those endpoints reject everyone else.
    React.useEffect(() => {
        if (!isRenter) return;
        async function isLiked() {
            try {
                const response = await rentalPost.isLiked(postId);
                setIsFavorite(response.result);
            } catch (error) {
                notifyError(error);
            }
        }
        isLiked();
        async function isReported() {
            try {
                const response = await rentalPost.isReported(postId);
                setIsReported(response.result);
            } catch (error) {
                notifyError(error);
            }
        }
        isReported();
    }, [postId, isRenter]);
    React.useEffect(() => {
        async function getNumberOfLike() {
            try {
                const response = await rentalPost.getLikes(postId);
                setNumberOfLike(Number.isInteger(response) ? response : 0);
            } catch (error) {
                notifyError(error);
            }
        }
        getNumberOfLike();
        async function getNumberOfView() {
            try {
                const response = await rentalPost.getViews(postId);
                setNumberOfView(response);
            } catch (error) {
                notifyError(error);
            }
        }
        getNumberOfView();
    }, [postId]);
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
