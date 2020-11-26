import React from 'react'
import PropTypes from 'prop-types'
import {FormGroup, FormLabel, Input} from '@material-ui/core'

ContactInfo.propTypes = {}

function ContactInfo(props) {
    const [initalValue, setInitalValue] = React.useState({
        name: '',
        phone: '',
        email: '',
        ownerAddress: '',
    })
    return (
        <div>
            <div class="card">
                <h5 class="card-header">Thông tin liên hệ</h5>
                <div class="card-body">
                    <FormGroup>
                        <FormLabel>Tên</FormLabel>
                        <Input name="name"/>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>SDT</FormLabel>
                        <Input name="phone" />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Địa chỉ</FormLabel>
                        <Input name="ownerAddress"/>
                    </FormGroup>
                </div>
            </div>
        </div>
    )
}

export default ContactInfo
