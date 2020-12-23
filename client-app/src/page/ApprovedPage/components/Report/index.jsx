import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ReportItem from './ReportItem';
import { useHistory } from 'react-router-dom';

const Report = () => {
    const history = useHistory();
    const [reportList, setReportList] = React.useState([]);
    React.useState(() => {
        async function getReportList() {
            try {
                const response = await rentalPost.getReportPost();
                setReportList([...response]);
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
        getReportList();
    }, []);
    const handleClick = (postId) => {
        history.push(`/post/${postId}`);
    };
    const handleResolve = async (id, index) => {
        try {
            const response = await rentalPost.postResolveReport(id);
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            reportList.splice(index, 1);
            setReportList([...reportList]);
        }
    };
    return (
        <div>
            <Card title="Phản hồi về bài đăng">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài đăng</th>
                            <th scope="col">Người đăng</th>
                            <th scope="col">Nội dung</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportList.length === 0 ? (
                            <p>Không có bài viết nào</p>
                        ) : (
                            reportList.map((item, index) => (
                                <ReportItem
                                    index={index}
                                    rentalPost={item}
                                    handleClick={handleClick}
                                    handleResolve={handleResolve}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Report;
