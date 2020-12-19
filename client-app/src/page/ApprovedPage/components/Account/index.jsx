import React, { Component } from 'react';
import './style.css';
import Card from '../../../../share/components/card';

const Account = () => {
    return (
        <div className="approved__account">
            <Card title={'Tài khoản đăng ký đang chờ'}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <button className="btn btn-danger">
                                    Từ chối
                                </button>
                                <button className="btn btn-primary">
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>Larry</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản chỉnh sửa đang chờ'}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <button className="btn btn-danger">
                                    Từ chối
                                </button>
                                <button className="btn btn-primary">
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>Larry</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản yêu cầu quyền chỉnh sửa'}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <button className="btn btn-danger">
                                    Từ chối
                                </button>
                                <button className="btn btn-primary">
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>Larry</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản đã xác nhận'}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <button className="btn btn-danger">
                                    Từ chối
                                </button>
                                <button className="btn btn-primary">
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>Larry</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Account;
