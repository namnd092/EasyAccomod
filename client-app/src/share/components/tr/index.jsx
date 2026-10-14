import React from 'react';
import PropTypes from 'prop-types';

TrTable.prototype = {
    thValue: PropTypes.string,
    tdValue: PropTypes.string,
    colspan: PropTypes.number,
}

function TrTable(props) {
    const {thValue, tdValue, colspan} = props;
    return (
        <tr className="w-full">
            <th className="bg-[#F9F9F9]">{thValue}</th>
            <td colSpan={colspan}>{tdValue}</td>
        </tr>
    );
}

export default TrTable;
