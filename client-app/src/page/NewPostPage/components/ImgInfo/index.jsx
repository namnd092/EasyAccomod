import React from 'react'
import PropTypes from 'prop-types'
import ImageUploader from 'react-images-upload';

ImgInfo.propTypes = {}

function ImgInfo(props) {
    const [images, setImages] = React.useState([]);
    const handleImageChange = (img) => {
        console.log(img)
        setImages([...images].concat(img));
    }
    return (
        <div class="card">
            <h5 class="card-header">Hình Ảnh</h5>
            <div class="card-body">
                <ImageUploader 
                    onChange={handleImageChange}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    withIcon={true}
                    withPreview={true}
                    label={'Chọn tối thiểu 3 ảnh, mỗi ảnh không quá 6MB'}
                    buttonText={'Chọn ảnh'}
                    name={'roomImageArr'}
                />
            </div>
        </div>
    )
}

export default ImgInfo
