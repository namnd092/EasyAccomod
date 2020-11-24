import React from 'react'
import PropTypes from 'prop-types'
import { AppBar, CardHeader, Tab, Tabs } from '@material-ui/core'
import './style.css'
import TabPanel from './components/TabPanel'

ApprovedPage.propTypes = {}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    }
}

function ApprovedPage(props) {
    const [value, setValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
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
                        <Tab label="Chỉnh sửa bài đăng" {...a11yProps(3)} />
                        <Tab label="Gia hạn" {...a11yProps(4)} />
                        <Tab label="Report" {...a11yProps(5)} />
                        {/* <Tab label="Item Seven" {...a11yProps(6)} /> */}
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <div class="card">
                        <h5 class="card-header">Bài đăng đang chờ</h5>
                        <div class="card-body">
                            <h5 class="card-title">Special title treatment</h5>
                            <p class="card-text">
                                With supporting text below as a natural lead-in
                                to additional content.
                            </p>
                            <a href="#" class="btn btn-primary">
                                Go somewhere
                            </a>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Item Four
                </TabPanel>
                <TabPanel value={value} index={4}>
                    Item Five
                </TabPanel>
                <TabPanel value={value} index={5}>
                    Item Six
                </TabPanel>
                <TabPanel value={value} index={6}>
                    Item Seven
                </TabPanel>
            </div>
        </div>
    )
}

export default ApprovedPage
