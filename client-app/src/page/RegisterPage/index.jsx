import { AppBar, Tab, Tabs } from '@mui/material';
import './style.css';
import React from 'react';
import TabPanel from '../../share/components/tab-panel';
import OwnerRegister from './Owner';
import RenterRegister from './Renter';

RegisterPage.propTypes = {};
function RegisterPage(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    return (
        <div className="registerPage">
            <div className="main">
                <div className="top">
                    <h4 className="title">ĐĂNG KÝ</h4>
                </div>
                <div className="bot">
                    <div>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Chủ nhà trọ" {...a11yProps(0)} />
                                <Tab label="Người Thuê Trọ" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            <OwnerRegister />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <RenterRegister />
                        </TabPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
