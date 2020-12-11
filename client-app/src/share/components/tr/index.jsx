import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

TrTable.prototype = {
    thValue: PropTypes.string,
    tdValue: PropTypes.string,
}

function TrTable(props) {
    const {thValue, tdValue} = props;
    return (
        <tr className="trtable">
            <th>{thValue}</th>
            <td>{tdValue}</td>
        </tr>
    );
}

export default TrTable;