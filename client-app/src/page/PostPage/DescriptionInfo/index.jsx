import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../../share/components/card';

DescriptionInfo.propTypes = {};

function DescriptionInfo(props) {
    const { descriptionInfo } = props;
    return (
        <div style={{ marginTop: '30px' }}>
            <Card title="Mô tả">{descriptionInfo}</Card>
        </div>
    );
}

export default DescriptionInfo;
