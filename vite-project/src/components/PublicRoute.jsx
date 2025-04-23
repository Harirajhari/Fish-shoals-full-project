// components/PublicRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { account } from "../appwrite";

const PublicRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                await account.get();
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? <Navigate to="/predict2" /> : children;
};

export default PublicRoute;
