import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../../share/components/card';

DescriptionInfo.propTypes = {};

function DescriptionInfo(props) {
    const { descriptionInfo } = props;
    return (
        <div>
            <Card title="Mô tả">
                <p>{descriptionInfo}</p>
            </Card>
        </div>
    );
}

export default DescriptionInfo;
