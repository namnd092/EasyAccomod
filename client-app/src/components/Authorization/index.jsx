import React from 'react';
import AuthorizationImg from '../../assets/img/401error.jpg';

export default function Authorization() {
    return (
        <div>
            {/* <h1>401 Authorization </h1>
            <h2>Bạn không có quyền try cập trang này</h2> */}
            <img src={AuthorizationImg} alt="" />
        </div>
    );
}
