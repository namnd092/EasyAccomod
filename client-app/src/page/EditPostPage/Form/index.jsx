import React from 'react';
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
import PostingTutorial from '../../NewPostPage/components/PostingTutorial';
import BasicInfo from '../../NewPostPage/components/BasicInfo';
import DescriptionInfo from '../../NewPostPage/components/DescriptionInfo';
import { Button } from '@material-ui/core';
import Card from '../../../share/components/card';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
export default function EditPostForm(props) {
    const [initialValue, setInitialValue] = React.useState(
        props.newPostInitialValue
            ? { ...props.newPostInitialValue }
            : {
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
              }
    );
    const {
        newPostInitialValue,
        handleSubmit,
        files,
        handleChangeFile,
        defaultValue,
    } = props;
    return (
        <div className="row">
            <div className="col-12 col-lg-4">
                <PostingTutorial />
            </div>
            <div className="col-12 col-lg-8">
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValue}
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
                                defaultValue={defaultValue}
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
    );
}
