import React from 'react';
import ImageUploader from 'react-images-upload';

ImgInfo.propTypes = {};

function ImgInfo(props) {
    const { errors, touched, defaultValue, setFieldValue, name } = props;
    const handleImageChange = async (imgArr) => {
        setFieldValue(name, imgArr);
    };
    return (
        <div class="card mt-4">
            <h5 class="card-header">Hình Ảnh</h5>
            <div class="card-body">
                <ImageUploader
                    onChange={handleImageChange}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    withIcon={true}
                    withPreview={true}
                    label={'Chọn tối thiểu 3 ảnh, mỗi ảnh không quá 6MB'}
                    buttonText={'Chọn ảnh'}
                    name={name}
                />
                {errors.roomImageArr && touched.roomImageArr && (
                    <span className="error">{errors.roomImageArr}</span>
                )}
            </div>
        </div>
    );
}

export default ImgInfo;
