import React from 'react';
import PropTypes from 'prop-types';

DescriptionInfo.propTypes = {
    
};

function DescriptionInfo(props) {
    return (
        <div class="card mt-2">
                <h5 class="card-header">Mô tả</h5>
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

export default DescriptionInfo;