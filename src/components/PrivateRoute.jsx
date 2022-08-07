import React from 'react';
import  { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from './Spinner';

const PrivateRoute = () => {

    const { loggedIn, loading } = useAuthStatus();

    if(loading) {
        return <Spinner />
    }

    if(loggedIn) {
        return (
            <Outlet />
          )
    } else {
        return (
            <Navigate to='/sign-in'/>
          )
    }
}

export default PrivateRoute
