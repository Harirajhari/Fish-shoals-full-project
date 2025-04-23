import React, { useEffect, useState } from "react";
import { account, databases } from "../appwrite";
import { Query } from "appwrite";

const DB_ID = "67f2ac870008dbcea22e";
const COLLECTION_ID = "67f2acb300265425e43a";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "", // Add phone field to form data
        password: "",
    });
    const [message, setMessage] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    console.log(searchHistory);

    // Fetch logged-in user info
    useEffect(() => {
        const getUser = async () => {
            try {
                const current = await account.get();
                setUser(current);
                setFormData({
                    name: current.name,
                    email: current.email,
                    phone: current.phone || "", // Set phone if it exists
                    password: "",
                });
                fetchUserSearches(current.$id);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        getUser();
    }, []);

    // Fetch documents where user_id matches current user's ID
    const fetchUserSearches = async (userId) => {
        try {
            const response = await databases.listDocuments(
                DB_ID,
                COLLECTION_ID,
                [Query.equal("user_id", userId)]
            );
            setSearchHistory(response.documents);
        } catch (error) {
            console.error("Error fetching user searches:", error);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Update profile handler
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update name if changed
            if (formData.name !== user.name) {
                await account.updateName(formData.name);
            }
            // Update email if changed
            if (formData.email !== user.email) {
                await account.updateEmail(formData.email);
            }
            // Update phone if changed
            if (formData.phone !== user.phone) {
                await account.updatePhone(formData.phone);
            }
            // Update password if provided
            if (formData.password) {
                await account.updatePassword(formData.password);
            }

            // Fetch the updated user info
            const updated = await account.get();
            setUser(updated);
            setFormData((prev) => ({ ...prev, password: "" }));  // Clear password field
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            setMessage("Update failed. Try again.");
        }
    };

    if (!user) return <p className="p-4">Loading profile...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Your Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Update Profile
                </button>
            </form>

            {message && (
                <p className="mt-4 text-center text-sm text-green-600 font-medium">{message}</p>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
                <p><strong>User ID:</strong> {user.$id}</p>
            </div>

            {/* Search History */}
            <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-4 text-blue-500">Search History</h3>

                {searchHistory.length > 0 ? (
                    <table className="w-full table-auto border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-3 py-2 border">Location Point</th>
                                <th className="px-3 py-2 border">Date</th>
                                <th className="px-3 py-2 border">Location</th>
                                <th className="px-3 py-2 border">Predicted Site</th>
                                <th className="px-3 py-2 border">Fish Shoals</th>
                                <th className="px-3 py-2 border">Habitat</th>
                                <th className="px-3 py-2 border">Active Tag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchHistory.map((entry) => (
                                <tr key={entry.$id} className="text-sm text-gray-700 text-center">
                                    <td className="border px-3 py-2">{entry.Location_point}</td>
                                    <td className="border px-2 py-1">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="border px-2 py-1">{entry.location}</td>
                                    <td className="border px-2 py-1">{entry.predicted_site}</td>
                                    <td className="border px-2 py-1">{entry.predicted_number_of_fish_shoals}</td>
                                    <td className="border px-2 py-1">{entry.predicted_habitat}</td>
                                    <td className="border px-2 py-1">
                                        <span className={entry.active_tag ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                            {entry.active_tag ? "Active" : "Deactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No search history found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
