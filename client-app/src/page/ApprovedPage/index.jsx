import React from 'react';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import './style.css';
import TabPanel from '../../share/components/tab-panel';
import RentalPost from './components/RentalPost';
import Account from './components/Account';
import Comment from './components/Comment';
import Extend from './components/Extend';
import Report from './components/Report';

ApprovedPage.propTypes = {};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

function ApprovedPage(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="approvedPage">
            <div>
                <AppBar
                    position="static"
                    color="default"
                    className="approvedPage__appBar"
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab label="Bài Đăng" {...a11yProps(0)} />
                        <Tab label="Tài Khoản" {...a11yProps(1)} />
                        <Tab label="Comment" {...a11yProps(2)} />

                        <Tab label="Gia hạn" {...a11yProps(3)} />
                        <Tab label="Report" {...a11yProps(4)} />
                    </Tabs>
                </AppBar>
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
