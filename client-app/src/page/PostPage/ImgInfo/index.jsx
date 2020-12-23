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
                'https://news.mogi.vn//wp-content/uploads/2018/11/mo-hinh-cho-thue-phong-tro-nao-thu-duoc-nhieu-tien-nhat-2018-3.png',
        },
        {
            url:
                'https://news.mogi.vn/wp-content/uploads/2019/06/cho-thue-phong-tro-cao-cap-anh-1.jpg',
        },
        {
            url:
                'https://d34zoy7mey8f6f.cloudfront.net/article_avatar/1568688779.jpg',
        },
        {
            url:
                'https://file4.batdongsan.com.vn/2018/08/07/20180807181855-d70c_wm.jpg',
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
