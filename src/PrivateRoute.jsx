

import { useContext } from "react";
import { AuthContext } from "./Provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>; // Loading spinner o dite paro iccha moto
    }

    if (user) {
        return children;
    }

    return <Navigate to="/signup" state={{ from: location }} replace />;
};

export default PrivateRoute;
