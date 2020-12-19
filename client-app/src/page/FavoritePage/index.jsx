import React from 'react';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';

export default function FavoritePage() {
    return (
        <div>
            <Card title="Bài đăng yêu thích">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" style={{ minWidth: '10%' }}>
                                Số thứ tự
                            </th>
                            <th scope="col">Bài đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>
                                <PostItem />
                            </td>
                            <td>
                                <button className="btn btn-danger">
                                    <i class="fas fa-heart"></i> Bỏ thích
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>
                                <PostItem />
                            </td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>
                                <PostItem />
                            </td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
