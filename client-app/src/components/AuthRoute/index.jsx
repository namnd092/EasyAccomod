import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { LinearProgress } from '../../ui';

function AuthRoute({ children }) {
    const location = useLocation();
    const isAuth = !!useSelector((state) => state.auth.token);
    const restoring = useSelector((state) => state.auth.restoring);

    if (restoring) {
        return <LinearProgress />;
    }

    if (isAuth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
}

export default AuthRoute;
