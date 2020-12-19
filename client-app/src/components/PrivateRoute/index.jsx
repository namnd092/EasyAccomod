import NotFound from '../NotFound';
import React from 'react';
const { Route, Redirect } = require('react-router-dom');

//const role = localStorage.getItem('role') || null;

function PrivateRoute({ component: Component, roles, ...rest }) {
    const role = React.useContext('role');
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
                // if (roles && roles.indexOf(role.toLowerCase()) === -1) {
                //     return <NotFound/>
                // }
                return <Component {...props} />;
            }}
        ></Route>
    );
}

export default PrivateRoute;
