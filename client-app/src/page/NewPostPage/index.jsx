import React from 'react';
import './style.css';
import { Form, Formik } from 'formik';
import {
    Backdrop,
    Button,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';
import BasicInfo from './components/BasicInfo';
import DescriptionInfo from './components/DescriptionInfo';
import ImgInfo from './components/ImgInfo';
import DurationInfo from './components/DurationInfo';
import PostingTutorial from './components/PostingTutorial';
import uploadMultipleFile from '../../utils/cloudinaryUpload';
import newPostInitialValue from '../../models/InitialValueForm/newPost';
import newPostValidationSchema from '../../models/ValidateForm/newPost';
import rentalPost from '../../api/rentalPost';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TelegramIcon from '@material-ui/icons/Telegram';

NewPostPage.propTypes = {};

function NewPostPage(props) {
    const history = useHistory();
    const user = useSelector((state) => state.user);
    const { role } = user;
    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles();
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
            history.push('/');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="newPostPage">
            <div className="row">
                <div className="col-12 col-lg-4">
                    <PostingTutorial />
                </div>
                <div className="col-12 col-lg-8">
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
                                        type="submit"
                                        color="primary"
                                        size="large"
                                        variant="contained"
                                        style={{ margin: '20px' }}
                                    >
                                        <TelegramIcon
                                            style={{ marginRight: '10px' }}
                                        />
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
                    className={classes.backdrop}
                    open={() => setIsLoading(true)}
                    onClick={() => setIsLoading(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </div>
    );
}

export default NewPostPage;
