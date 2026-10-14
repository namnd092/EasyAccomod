import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { LinearProgress } from '../../ui';
import Authorization from '../Authorization';

function PrivateRoute({ children, roles }) {
    const role = useSelector((state) => state.user.role);
    const location = useLocation();
    const auth = !!useSelector((state) => state.auth.token);
    const restoring = useSelector((state) => state.auth.restoring);

    // A returning visitor's session is still being restored from the refresh cookie.
    if (restoring) {
        return <LinearProgress />;
    }

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    const allowed = roles?.map((r) => r.toLowerCase());
    if (allowed && role && !allowed.includes(role.toLowerCase())) {
        return <Authorization />;
    }
    return children;
}

export default PrivateRoute;
