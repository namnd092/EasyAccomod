import React from 'react';
import './style.css';
import { Form, Formik } from 'formik';
import { Button } from '@material-ui/core';
import BasicInfo from './components/BasicInfo';
import DescriptionInfo from './components/DescriptionInfo';
import ImgInfo from './components/ImgInfo';
import DurationInfo from './components/DurationInfo';
import PostingTutorial from './components/PostingTutorial';
import ContactInfo from './components/ContactInfo';
import uploadMultipleFile from '../../utils/cloudinaryUpload';
import newPostInitialValue from '../../models/InitialValueForm/newPost';
import newPostValidationSchema from '../../models/ValidateForm/newPost';
import rentalPost from '../../api/rentalPost';

NewPostPage.propTypes = {};

function NewPostPage(props) {
    const [newPostFormValue, setNewPostFormValue] = React.useState(
        newPostInitialValue
    );
    const handleBasicInfoChange = (basicInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...basicInfo });
    };
    const handleDescriptionInfoChange = (descriptionInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...descriptionInfo });
    };
    const handleContactInfoChange = (contactInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...contactInfo });
    };
    const handleImgInfoChange = (imgInfo) => {
        setNewPostFormValue({ ...newPostFormValue, ...imgInfo });
    };
    const handleDurationInfoChange = () => {};
    const handleSubmit = async () => {
        const { roomImageArr } = newPostFormValue;
        const accommodationPictures = await uploadMultipleFile(roomImageArr);
        await rentalPost.postNewPost({
            ...newPostFormValue,
            accommodationPictures,
        });
    };
    return (
        <div className="newPostPage">
            <div className="row">
                <div className="col-8">
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={newPostInitialValue}
                        validationSchema={newPostValidationSchema}
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
                                <ContactInfo
                                    handleContactInfoChange={
                                        handleContactInfoChange
                                    }
                                    errors={errors}
                                    touched={touched}
                                />
                                <ImgInfo
                                    handleImgInfoChange={handleImgInfoChange}
                                    errors={errors}
                                    touched={touched}
                                />
                                <DurationInfo
                                    handleDurationInfoChange={
                                        handleDurationInfoChange
                                    }
                                    errors={errors}
                                    touched={touched}
                                />
                                <div>
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Đăng Tin
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-4">
                    <PostingTutorial />
                </div>
            </div>
        </div>
    );
}

export default NewPostPage;
