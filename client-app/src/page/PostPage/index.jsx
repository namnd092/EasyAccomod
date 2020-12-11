import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { } from '@material-ui/core'
import BasicInfo from './BasicInfo';
import DescriptionInfo from './DescriptionInfo';
import ImgInfo from './ImgInfo';
import ShareInfo from './ShareInfo';
import CommentInfo from './CommentInfo';
PostPage.propTypes = {}

function PostPage(props) {
    const { id } = useParams()
    return (
        <div>
            <BasicInfo />
            <DescriptionInfo />
            <ImgInfo />
            <ShareInfo />
            <CommentInfo />
        </div>
    )
}

export default PostPage
