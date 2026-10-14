import React from 'react';
import rentalPost from '../../../../api/rentalPost';
import Card from '../../../../share/components/card';
import ReportItem from './ReportItem';
import { useNavigate } from 'react-router-dom';
import { tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

const Report = () => {
    const navigate = useNavigate();
    const [reportList, setReportList] = React.useState([]);
    React.useEffect(() => {
        async function getReportList() {
            try {
                const response = await rentalPost.getReportPost();
                setReportList([...response]);
            } catch (error) {
                notifyError(error);
            }
        }
        getReportList();
    }, []);
    const handleClick = (postId) => {
        navigate(`/post/${postId}`);
    };
    const handleResolve = async (id) => {
        try {
            await rentalPost.postResolveReport(id);
            setReportList((list) => list.filter((report) => report.id !== id));
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div>
            <Card title="Phản hồi về bài đăng">
                <table className={tableClass}>
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
