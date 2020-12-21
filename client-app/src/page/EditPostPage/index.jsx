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
import { Form, Formik } from 'formik';
import Card from '../../share/components/card';
import BasicInfo from '../NewPostPage/components/BasicInfo';
import newPostInitialValue from '../../models/InitialValueForm/newPost';
import newPostValidationSchema from '../../models/ValidateForm/newPost';
import PostingTutorial from '../NewPostPage/components/PostingTutorial';
import DescriptionInfo from '../NewPostPage/components/DescriptionInfo';
import DurationInfo from '../NewPostPage/components/DurationInfo';
import { Button } from '@material-ui/core';
import uploadMultipleFile from '../../utils/cloudinaryUpload';
import { useParams } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ButtonDrag = () => {
    return (
        <Button type="submit" color="primary" size="large" variant="contained">
            Thêm ảnh
        </Button>
    );
};

const EditPostPage = () => {
    const { id } = useParams();
    const [files, setFiles] = React.useState([
        'https://res.cloudinary.com/dsysolkex/image/upload/v1604846728/vth1yoqreqgzzeww0dby.jpg',
    ]);
    const handleChangeFile = (fileArr) => {
        setFiles(fileArr);
        setNewPostFormValue({ ...newPostFormValue, roomImageArr: fileArr });
    };
    const [newPostFormValue, setNewPostFormValue] = React.useState({
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
                setNewPostFormValue({
                    ...newPostFormValue,
                    street: 'xd',
                });
                console.log({ ...newPostFormValue });
            } catch (error) {
                console.log(error);
            }
        }
        getDefaultValue();
    }, []);
    return (
        <div className="editPostPage">
            <div className="row">
                <div className="col-12 col-lg-4">
                    <PostingTutorial />
                </div>
                <div className="col-12 col-lg-8">
                    <Formik
                        enableReinitialize
                        initialValues={newPostInitialValue}
                        onSubmit={(value) => handleSubmit(value)}
                    >
                        {({
                            errors,
                            touched,
                            isValid,
                            handleChange,
                            values,
                            handleBlur,
                            setFieldTouched,
                            setFieldValue,
                        }) => (
                            <Form>
                                <BasicInfo
                                    handleChange={handleChange}
                                    errors={errors}
                                    touched={touched}
                                    values={values}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                />
                                <DescriptionInfo
                                    name="description"
                                    errors={errors}
                                    touched={touched}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                                <Card title="Hình ảnh">
                                    <FilePond
                                        files={files}
                                        allowReorder={true}
                                        allowMultiple={true}
                                        onupdatefiles={handleChangeFile}
                                        labelIdle={'Thêm ảnh'}
                                    />
                                </Card>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        color="primary"
                                        size="large"
                                        variant="contained"
                                        style={{ margin: '20px' }}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default EditPostPage;
