import React from 'react';
import './style.css';
import TabPanel from '../../share/components/tab-panel';
import RentalPost from './components/RentalPost';
import Account from './components/Account';
import Comment from './components/Comment';
import Extend from './components/Extend';
import Report from './components/Report';
import { Tabs } from '../../ui';

function ApprovedPage() {
    const [value, setValue] = React.useState(0);

    return (
        <div className="approvedPage">
            <div>
                <Tabs
                    className="approvedPage__appBar"
                    tabs={['Bài Đăng', 'Tài Khoản', 'Comment', 'Gia hạn', 'Report']}
                    value={value}
                    onChange={setValue}
                />
                <TabPanel value={value} index={0}>
                    <RentalPost />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Account />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Comment />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Extend />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <Report />
                </TabPanel>
            </div>
        </div>
    );
}

export default ApprovedPage;
