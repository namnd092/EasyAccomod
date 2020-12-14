import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormLabel } from '@material-ui/core';
import JoditEditor from 'jodit-react';

DescriptionInfo.propTypes = {
    handleDescriptionInfoChange: PropTypes.func,
};

function DescriptionInfo(props) {
    const { handleDescriptionInfoChange } = props;
    //const [description, setDescription] = React.useState(RichTextEditor.createEmptyValue());
    const handleDescriptionChange = (value) => {
        const description = value.target.innerHTML;
        handleDescriptionInfoChange({ description });
    };
    return (
        <div class="card mt-4">
            <h5 class="card-header">Thông tin mô tả</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    {/* <TextareaAutosize rowsMin={10} name="description" /> */}
                    {/* <RichTextEditor 
                        value={description}
                        onChange={handleDescriptionChange}
                        customStyleMap={{backgroundColor: 'red'}}
                        placeholder="Mô tả về phòng trọ của bạn"
                        
                    /> */}
                    <JoditEditor
                        //value={description}
                        onBlur={handleDescriptionChange}
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
