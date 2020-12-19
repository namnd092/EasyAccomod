import React from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
import './style.css';

ImgInfo.propTypes = {};

function ImgInfo(props) {
    const image = [
        {
            url:
                'https://res.cloudinary.com/dsysolkex/image/upload/v1604751491/jcnqq8zdrtsxc4fkm9bt.jpg',
        },
        {
            url:
                'https://res.cloudinary.com/dsysolkex/image/upload/v1604751431/xexkcc7lnjepsoabqr92.jpg',
        },
        {
            url:
                'https://res.cloudinary.com/dsysolkex/image/upload/v1604751429/jmryxivgrjrsxgwyhmqr.jpg',
        },
        {
            url:
                'https://res.cloudinary.com/dsysolkex/image/upload/v1607705664/pexels-simon-matzinger-1183099_zxzit1.jpg',
        },
    ];
    return (
        <div className="card mt-2">
            <h5 className="card-header">Hình ảnh</h5>
            <div className="card-body">
                <div className="slider_block">
                    <div className="slider">
                        <SimpleImageSlider
                            images={image}
                            width={'97%'}
                            height={'80%'}
                            showNavs={true}
                            showBullets={true}
                            useGPURender={true}
                            navStyle={2}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImgInfo;