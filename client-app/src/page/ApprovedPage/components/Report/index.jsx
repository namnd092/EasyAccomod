import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';

const Report = () => {
    const [reportList, setPostList] = React.useState([]);
    React.useState(() => {
        async function getReportList() {
            try {
                const response = await rentalPost.getReportPost();
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        getReportList();
    }, []);
    return (
        <div>
            <Card title="Phản hồi về bài đăng">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Email</th>
                            <th scope="col">Ngày đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportList.length === 0 ? (
                            <p>Không có bài viết nào</p>
                        ) : (
                            reportList
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Report;
