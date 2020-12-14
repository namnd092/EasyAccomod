import React from 'react';
import PropTypes from 'prop-types';

PostingTutorial.propTypes = {};

function PostingTutorial(props) {
    return (
        <div class="card mt-4">
            <h5 class="card-header">Hướng dẫn đăng tin</h5>
            <div class="card-body">
                <ul>
                    <li style={{ fontWeight: 'bolder' }}>
                        Thông tin có dấu * là bắt buộc.
                    </li>
                    <li style={{ fontWeight: 'bolder' }}>
                        Nội dung phải viết bằng tiếng Việt có dấu
                    </li>
                    <li style={{ fontWeight: 'bolder' }}>
                        Tiêu đề tin không dài quá 100 kí tự
                    </li>
                    <li>
                        Các bạn nên điền đầy đủ thông tin vào các mục để tin
                        đăng có hiệu quả hơn.
                    </li>
                    <li>
                        Để tăng độ tin cậy và tin rao được nhiều người quan tâm
                        hơn, hãy sửa vị trí tin rao của bạn trên bản đồ bằng
                        cách kéo icon tới đúng vị trí của tin rao.
                    </li>
                    <li>
                        Tin đăng có hình ảnh rõ ràng sẽ được xem và gọi gấp
                        nhiều lần so với tin rao không có ảnh. Hãy đăng ảnh để
                        được giao dịch nhanh chóng!
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PostingTutorial;
