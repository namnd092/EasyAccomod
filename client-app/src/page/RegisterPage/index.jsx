import { AppBar, makeStyles, Tab, Tabs, useTheme } from '@material-ui/core';
import './style.css';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import TabPanel from '../../share/components/tab-panel';
import OwnerRegister from './Owner';
import RenterRegister from './Renter';

RegisterPage.propTypes = {};
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
}));
function RegisterPage(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
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
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel
                                value={value}
                                index={0}
                                dir={theme.direction}
                            >
                                <OwnerRegister />
                            </TabPanel>
                            <TabPanel
                                value={value}
                                index={1}
                                dir={theme.direction}
                            >
                                <RenterRegister />
                            </TabPanel>
                        </SwipeableViews>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
