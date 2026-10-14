import React from 'react';
import { Form, Formik } from 'formik';
import BasicInfo from './components/BasicInfo';
import DescriptionInfo from './components/DescriptionInfo';
import ImgInfo from './components/ImgInfo';
import DurationInfo from './components/DurationInfo';
import PostingTutorial from './components/PostingTutorial';
import uploadMultipleFile from '../../utils/cloudinaryUpload';
import newPostInitialValue from '../../models/InitialValueForm/newPost';
import newPostValidationSchema from '../../models/ValidateForm/newPost';
import rentalPost from '../../api/rentalPost';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Spinner, Backdrop } from '../../ui';

NewPostPage.propTypes = {};

function NewPostPage(props) {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const { role } = user;

    const [isLoading, setIsLoading] = React.useState(false);
    const handleSubmit = async (values) => {
        //event.preventDefault();
        console.log(values);
        const { roomImageArr } = values;
        try {
            setIsLoading(true);
            const accommodationPictures = await uploadMultipleFile(
                roomImageArr
            );
            const newAccommodationPictures = accommodationPictures.map((e) => ({
                PictureLink: e,
            }));
            let params = {
                ...values,
                accommodationPictures: newAccommodationPictures,
            };
            const response = await rentalPost.postNewPost(params);
            console.log(response);
            navigate('/');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="newPostPage">
            <div className="grid grid-cols-12 gap-x-4">
                <div className="col-span-12 lg:col-span-4">
                    <PostingTutorial />
                </div>
                <div className="col-span-12 lg:col-span-8">
                    <Formik
                        initialValues={newPostInitialValue}
                        onSubmit={(value) => handleSubmit(value)}
                        validationSchema={newPostValidationSchema}
                    >
                        {({
                            errors,
                            touched,
                            isValid,
                            values,
                            handleChange,
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
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />
                                <ImgInfo
                                    errors={errors}
                                    touched={touched}
                                    setFieldValue={setFieldValue}
                                    name="roomImageArr"
                                />
                                <DurationInfo
                                    handleChange={handleChange}
                                    errors={errors}
                                    touched={touched}
                                    values={values}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        type="submit" size="lg"
                                        style={{ margin: '20px' }}
                                    >
                                        <i className="fas fa-paper-plane mr-2.5"></i>
                                        Đăng Tin
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            {isLoading && (
                <Backdrop
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
                    open
                    onClick={() => setIsLoading(false)}
                >
                    <Spinner color="inherit" />
                </Backdrop>
            )}
        </div>
    );
}

export default NewPostPage;
