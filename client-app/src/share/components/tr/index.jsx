import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

TrTable.prototype = {
    thValue: PropTypes.string,
    tdValue: PropTypes.string,
    colspan: PropTypes.number,
}

function TrTable(props) {
    const {thValue, tdValue, colspan} = props;
    return (
        <tr className="trtable">
            <th>{thValue}</th>
            <td colSpan={colspan}>{tdValue}</td>
        </tr>
    );
}

export default TrTable;