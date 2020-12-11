import React from 'react';
import PropTypes from 'prop-types';

CommentInfo.propTypes = {
    
};

function CommentInfo(props) {
    return (
        <div class="card mt-2">
                <h5 class="card-header">Bình luận</h5>
                <div class="card-body">
                    <h5 class="card-title">Special title treatment</h5>
                    <p class="card-text">
                        With supporting text below as a natural lead-in to
                        additional content.
                    </p>
                    <a href="#" class="btn btn-primary">
                        Go somewhere
                    </a>
                </div>
            </div>
    );
}

export default CommentInfo;