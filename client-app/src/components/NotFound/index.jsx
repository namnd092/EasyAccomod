import React from 'react';
import NotFoundImg from '../../assets/img/404error.jpg';
export default function NotFound() {
    return (
        <div style={{ paddingTop: '50px' }}>
            <img src={NotFoundImg} alt="" width="100%" />
        </div>
    );
}
