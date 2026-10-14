import './style.css';
import React from 'react';
import TabPanel from '../../share/components/tab-panel';
import OwnerRegister from './Owner';
import RenterRegister from './Renter';
import { Tabs } from '../../ui';

function RegisterPage() {
    const [value, setValue] = React.useState(0);

    return (
        <div className="registerPage">
            <div className="main">
                <div className="top">
                    <h4 className="title">ĐĂNG KÝ</h4>
                </div>
                <div className="bot">
                    <div>
                        <Tabs
                            tabs={['Chủ nhà trọ', 'Người Thuê Trọ']}
                            value={value}
                            onChange={setValue}
                        />
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
