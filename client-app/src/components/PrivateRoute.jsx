import NotFound from './NotFound';
// import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import authApi from './../api/authApi';
// import {setUser} from '../redux/slice/userSlice'
const { Route, Redirect } = require("react-router-dom");
const auth = localStorage.getItem('token') !== null;

//const role = localStorage.getItem('role') || null;


function PrivateRoute({ component: Component, roles, role, ...rest }) {
    return (
        <Route {...rest} render={props => {
            if (!auth) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            if (roles && role && roles.indexOf(role.toLowerCase()) === -1) {
                return <NotFound/>
            }
            return <Component {...props}/>
        }} >
        </Route>
    );
}

export default PrivateRoute;
