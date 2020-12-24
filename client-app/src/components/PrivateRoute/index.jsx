import NotFound from '../NotFound';
import React from 'react';
import { useSelector } from 'react-redux';
import Authorization from '../Authauthorization';
const { Route, Redirect } = require('react-router-dom');

//const role = localStorage.getItem('role') || null;

function PrivateRoute({ component: Component, roles, ...rest }) {
    const role = useSelector((state) => state.user.role);
    const auth = !!localStorage.getItem('token');
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!auth) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location },
                            }}
                        />
                    );
                }
                if (roles && role && roles.indexOf(role.toLowerCase()) === -1) {
                    return <Authorization />;
                }
                return <Component {...props} />;
            }}
        ></Route>
    );
}

export default PrivateRoute;
