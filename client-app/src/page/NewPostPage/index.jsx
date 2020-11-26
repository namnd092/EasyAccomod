import React from 'react'
import PropTypes from 'prop-types'
import { Form, Formik } from 'formik'
import { Button } from '@material-ui/core'
import BasicInfo from './components/BasicInfo'
import DescriptionInfo from './components/DescriptionInfo'
import ImgInfo from './components/ImgInfo'
import DurationInfo from './components/DurationInfo'
import PostingTutorial from './components/PostingTutorial'
import ContactInfo from './components/ContactInfo'

NewPostPage.propTypes = {}

function NewPostPage(props) {
    const initialValues = {
        title: null,
        roomType: null,
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
        waterElectricity: null,
        electricityPrice: null,
        waterPrice: null,
        name: null,
        phone: null,
        email: null,
        ownerAddress: null,
        description: null,
        numberOfDay: null,
        totalPrice: null,
        roomImageArr: [],
    }
    const [newPostFormValue, setNewPostFormValue] = React.useState(
        initialValues
    )
    const handleBasicInfoChange = () => {}
    const handleDescriptionInfoChange = () => {}
    const handleContactInfoChange = () => {}
    const handleImgInfoChange = () => {}
    const handleDurationInfoChange = () => {}
    const handleSubmit = (value) => {
        console.log(value)
    }
    return (
        <div className="">
            <h1>Đăng tin phòng</h1>
            <div className="row">
                <div className="col-8">
                    <Formik
                        onSubmit={(value) => handleSubmit(value)}
                        initialValues={initialValues}
                    >
                        <Form>
                            <BasicInfo
                                handleBasicInfoChange={handleBasicInfoChange}
                            />
                            <DescriptionInfo
                                handleDescriptionInfoChange={
                                    handleDescriptionInfoChange
                                }
                            />
                            <ContactInfo
                                handleContactInfoChange={
                                    handleContactInfoChange
                                }
                            />
                            <ImgInfo
                                handleImgInfoChange={handleImgInfoChange}
                            />
                            <DurationInfo
                                handleDurationInfoChange={
                                    handleDurationInfoChange
                                }
                            />
                            <div>
                                <Button type="submit">Đăng Tin</Button>
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="col-4">
                    <PostingTutorial />
                </div>
            </div>
        </div>
    )
}

export default NewPostPage
