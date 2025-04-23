import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite";

const Home = () => {
    const [user, setUser] = useState(null);
    console.log(user);
    
    
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (err) {
                setUser(null);
                console.warn("No user session found:", err);
            }
        };

        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-10 shadow-xl text-white border border-white/30 w-full max-w-md text-center">
                <h2 className="text-3xl font-bold mb-4">👋 Welcome</h2>
                {user ? (
                    <>
                        <p className="text-xl mb-6">{user.email}</p>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition duration-200 shadow-md"
                        >
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <p className="text-xl text-red-200">User not found</p>
                )}
            </div>
        </div>
    );
};

export default Home;
