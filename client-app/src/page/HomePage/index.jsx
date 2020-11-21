import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import './styles.css';

export const HomePage = () => {
    const username = useSelector(state => state.user.name)

    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

// Home.propTypes = {
//     prop: PropTypes
// }

