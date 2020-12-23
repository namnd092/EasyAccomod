import React from 'react';
import SimpleImageSlider from 'react-simple-image-slider';
import Card from '../../../share/components/card';
import './style.css';

ImgInfo.propTypes = {};

function ImgInfo(props) {
    const { imgInfo } = props;
    const image1 = [
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
    const [imgArr, setImgArr] = React.useState(image1);
    React.useEffect(() => {
        async function getImgPostInfoEffect() {
            if (imgInfo) {
                setImgArr([...imgInfo].map((e) => ({ url: e.pictureLink })));
            }
        }
        getImgPostInfoEffect();
    }, imgInfo);

    return (
        <div style={{ marginTop: '30px' }}>
            <Card title="Hình ảnh">
                <div className="slider_block">
                    <div className="slider">
                        <SimpleImageSlider
                            images={imgArr}
                            width={'97%'}
                            height={'80%'}
                            showNavs={true}
                            showBullets={true}
                            useGPURender={true}
                            navStyle={2}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ImgInfo;
