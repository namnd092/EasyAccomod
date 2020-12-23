import React, { useState } from 'react';
import './style.css';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import newPostInitialValue from '../../models/InitialValueForm/newPost';
import newPostValidationSchema from '../../models/ValidateForm/newPost';

import uploadMultipleFile from '../../utils/cloudinaryUpload';
import { useParams } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import EditPostForm from './Form';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditPostPage = () => {
    const { id } = useParams();
    const [files, setFiles] = React.useState([
        'https://res.cloudinary.com/dsysolkex/image/upload/v1604846728/vth1yoqreqgzzeww0dby.jpg',
    ]);
    const handleChangeFile = (fileArr) => {
        setFiles(fileArr);
        setNewPostFormValue({ ...newPostFormValue, roomImageArr: fileArr });
    };
    let [newPostFormValue, setNewPostFormValue] = React.useState({
        title: null,
        roomType: {},
        province: null,
        district: null,
        ward: null,
        street: null,
        roomPrice: null,
        roomArea: null,
        roomQuantity: null,
        liveWithOwner: false,
        closeBathroom: false,
        haveWaterHeader: false,
        haveAirCondition: false,
        haveBalcony: false,
        waterElectricity: 'rent',
        electricityPrice: null,
        waterPrice: null,
        description: null,
        numberOfDay: null,
        totalPrice: null,
        roomImageArr: [],
        kitchenType: null,
        publicLocationNearby: null,
        package: {
            value: 1,
            label: 'Đăng theo tuần',
            price: 1000,
            type: 'tuần',
        },
        numberOfTime: 1,
        owner: {},
    });
    const [defaultValue, setDefaultValue] = React.useState(null);
    const handleSubmit = async (value) => {
        console.log(value);
        const newFiles = files.map((file) => file.file);
        console.log(newFiles);
        // try {
        //     const response = await uploadMultipleFile(newFiles);
        //     console.log(response);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    React.useEffect(() => {
        async function getDefaultValue() {
            try {
                const response = await rentalPost.getRentalPostInfo(id);
                console.log(response);
                setDefaultValue(response);
            } catch (error) {
                console.log(error);
            }
        }
        getDefaultValue();
    }, []);
    console.log(defaultValue);
    return (
        <div className="editPostPage">
            <EditPostForm
                newPostInitialValue={newPostInitialValue}
                handleSubmit={handleSubmit}
                files={files}
                handleChangeFile={handleChangeFile}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default EditPostPage;
