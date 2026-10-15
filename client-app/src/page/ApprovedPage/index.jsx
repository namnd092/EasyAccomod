import React from 'react';
import './style.css';
import { useSearchParams } from 'react-router-dom';
import TabPanel from '../../share/components/tab-panel';
import RentalPost from './components/RentalPost';
import Account from './components/Account';
import Comment from './components/Comment';
import Extend from './components/Extend';
import Report from './components/Report';
import { Tabs } from '../../ui';

// The tabs in order; `key` is what the URL carries (?tab=accounts), none for the first tab.
const TABS = [
    { key: 'posts', label: 'Bài Đăng', Panel: RentalPost },
    { key: 'accounts', label: 'Tài Khoản', Panel: Account },
    { key: 'comments', label: 'Bình luận', Panel: Comment },
    { key: 'extend', label: 'Gia hạn', Panel: Extend },
    { key: 'reports', label: 'Phản hồi', Panel: Report },
];

function ApprovedPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const found = TABS.findIndex(({ key }) => key === searchParams.get('tab'));
    const value = found === -1 ? 0 : found;
    const setValue = (index) => setSearchParams(index === 0 ? {} : { tab: TABS[index].key });

    return (
        <div className="approvedPage">
            <div>
                <Tabs
                    className="approvedPage__appBar"
                    tabs={TABS.map(({ label }) => label)}
                    value={value}
                    onChange={setValue}
                />
                {TABS.map(({ key, Panel }, index) => (
                    <TabPanel key={key} value={value} index={index}>
                        <Panel />
                    </TabPanel>
                ))}
            </div>
        </div>
    );
}

export default ApprovedPage;
