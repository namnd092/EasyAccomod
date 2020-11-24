import { useState } from 'react';
import {useSelector} from 'react-redux'
const { Route, Redirect } = require("react-router-dom");
const auth = localStorage.getItem('token')
function AuthRoute({ component: Component, roles, role, ...rest }) {
    
    return (
        <Route {...rest} render={props => {
            if(role){
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            return <Component {...props}/>
        }} >
        </Route>
    );
}

export default AuthRoute;