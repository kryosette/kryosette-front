import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the AuthContext

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;