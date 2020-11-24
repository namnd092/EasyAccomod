import React from 'react'
import PropTypes from 'prop-types'
import { Form, Formik } from 'formik'
import { Button } from '@material-ui/core'
import BasicInfo from './components/BasicInfo'
import DescriptionInfo from './components/DescriptionInfo'
import ImgInfo from './components/ImgInfo'
import DurationInfo from './components/DurationInfo'
import PostingTutorial from './components/PostingTutorial'

NewPostPage.propTypes = {}

function NewPostPage(props) {
    return (
        <div className="">
            <h1>Đăng tin phòng</h1>
            <div className="row">
                <div className="col-8">
                    <Formik>
                        <Form>
                            <BasicInfo/>
                            <DescriptionInfo/>
                            <ImgInfo/>
                            <DurationInfo/>
                            <div>
                                <Button>Đăng Tin</Button>
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="col-4">
                    <PostingTutorial/>
                </div>
            </div>
        </div>
    )
}

export default NewPostPage
