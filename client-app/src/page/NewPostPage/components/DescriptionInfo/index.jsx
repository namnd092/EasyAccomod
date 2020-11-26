import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormLabel, TextareaAutosize } from '@material-ui/core'

DescriptionInfo.propTypes = {}

function DescriptionInfo(props) {
    return (
        <div class="card">
            <h5 class="card-header">Thông tin mô tả</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    <TextareaAutosize rowsMin={10} name="description"/>
                </FormGroup>
            </div>
        </div>
    )
}

export default DescriptionInfo
