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
    const [files, setFiles] = React.useState([
        'https://res.cloudinary.com/dsysolkex/image/upload/v1607093118/screenshot-localhost-3000-1604988485249_spu3eq.png',
    ]);
    const handleChangeFile = (fileArr) => {
        console.log(fileArr);
        setFiles(fileArr);
        setNewPostFormValue({ ...newPostFormValue, roomImageArr: fileArr });
    };
    const [newPostFormValue, setNewPostFormValue] = React.useState(
        newPostInitialValue
    );
    const handleBasicInfoChange = (basicInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...basicInfo });
    };
    const handleDescriptionInfoChange = (descriptionInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...descriptionInfo });
    };
    const handleDurationInfoChange = () => {};
    const handleSubmit = () => {
        console.log(newPostFormValue);
    };
    return (
        <div className="editPostPage">
            <div className="row">
                <div className="col-12 col-lg-4">
                    <PostingTutorial />
                </div>
                <div className="col-12 col-lg-8">
                    <Formik
                        initialValues={newPostInitialValue}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isValid }) => (
                            <Form>
                                <BasicInfo
                                    handleBasicInfoChange={
                                        handleBasicInfoChange
                                    }
                                    errors={errors}
                                    touched={touched}
                                />
                                <DescriptionInfo
                                    handleDescriptionInfoChange={
                                        handleDescriptionInfoChange
                                    }
                                    errors={errors}
                                    touched={touched}
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
                                <DurationInfo
                                    handleDurationInfoChange={
                                        handleDurationInfoChange
                                    }
                                    errors={errors}
                                    touched={touched}
                                />
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
