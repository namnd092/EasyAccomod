import React from 'react';
import ExtendDuration from '../extend';
import rentalPost from '../../../api/rentalPost';
import { getTime } from '../../../helper/time';
import { Button } from '../../../ui';
function SuccessItem(props) {
    const { index, item, handleClick } = props;
    const [isRented, setRented] = React.useState(item.accommodationWasRented);
    const [openExtend, setOpenExtend] = React.useState(false);
    const hanldeChangeIsRented = async () => {
        setRented(!isRented);
        try {
            const response = await rentalPost.putOwnerSetRentalStatus(
                !isRented,
                item.accommodationId
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th scope="row" onClick={() => handleClick(item.id)}>
                {index + 1}
            </th>
            <td onClick={() => handleClick(item.id)}>{item && item.title}</td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.address.province.name}
            </td>

            <td
                style={{ textAlign: 'center' }}
                onClick={() => handleClick(item.id)}
            >
                {item && item.views}
            </td>
            <td
                style={{ textAlign: 'center' }}
                onClick={() => handleClick(item.id)}
            >
                {item && item.likes}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {getTime(item.dateExpired)}
            </td>
            <td>
                {isRented ? (
                    <Button
                        onClick={hanldeChangeIsRented}
                    >
                        <i className="fas fa-check-square"></i>
                        Đã cho thuê
                    </Button>
                ) : (
                    <Button
                        onClick={hanldeChangeIsRented}
                    >
                        <i className="far fa-square"></i>
                        Chưa cho thuê
                    </Button>
                )}
            </td>
            <td>
                <Button variant="danger" onClick={() => setOpenExtend(true)}>
                    <i className="fas fa-money-check-alt"></i> Gia hạn
                </Button>
                <ExtendDuration
                    postId={item.id}
                    open={openExtend}
                    onClose={() => setOpenExtend(false)}
                />
            </td>
        </tr>
    );
}

export default SuccessItem;
