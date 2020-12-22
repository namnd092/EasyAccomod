import React from 'react';
import Card from '../../../../share/components/card';

const RenterPost = (props) => {
    return (
        <div>
            <Card title="Bài đăng đang chờ">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Giờ đăng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry the Bird</td>
                            <td>Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Card title="Bài đăng bị từ chối"></Card>
            <Card title="Bài đăng đã duyệt"></Card>
        </div>
    );
};

export default RenterPost;
