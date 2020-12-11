import React from 'react';
import {Zoom } from 'react-slideshow-image';
import PropTypes from 'prop-types';

ImgInfo.propTypes = {
    
};

function ImgInfo(props) {
    const [imgArr, setImgArr] = React.useState([]);
    return (
        <div className="card mt-2">
                <h5 className="card-header">Hình ảnh</h5>
                <div className="card-body">
                    {imgArr.map(img => (
                        <Zoom key/>
                    ))}
                </div>
            </div>
    );
}

export default ImgInfo;