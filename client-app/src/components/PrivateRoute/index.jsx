import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Authorization from '../Authauthorization';

function PrivateRoute({ children, roles }) {
    const role = useSelector((state) => state.user.role);
    const location = useLocation();
    const auth = !!localStorage.getItem('token');

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
