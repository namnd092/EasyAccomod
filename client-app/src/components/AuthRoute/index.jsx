import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function AuthRoute({ children }) {
    const location = useLocation();
    const isAuth = !!localStorage.getItem('token');

    if (isAuth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
}

export default AuthRoute;
