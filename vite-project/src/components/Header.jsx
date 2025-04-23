// components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../appwrite";
import { UserCircle } from "lucide-react"; // optional icon

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const current = await account.get();
                setUser(current);
            } catch {
                setUser(null);
            }
        };
        checkUser();
    }, []);

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-black-600">
                Fish shoals App
            </Link>
            <div className="flex items-center gap-4">
                {!user ? (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                            Login
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            Signup
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile" className="flex items-center gap-1 hover:text-blue-600">
                            <UserCircle className="w-6 h-6 text-blue-600 cursor-pointer" />
                            <span className="text-gray-700">{user.email}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
