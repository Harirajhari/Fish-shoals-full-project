import React, { useEffect, useState } from 'react';
import { databases } from '../appwrite'; // adjust path if needed

const UserGone = ({ id }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchGoneUsers = async () => {
      try {
        const response = await databases.listDocuments(
          "67f2ac870008dbcea22e", // Database ID
          "67f9c0c4001fc79babf0"  // Collection ID
        );

        // Filter based on 'id'
        const filteredUsers = id
          ? response.documents.filter(user => {
              const locationPoint = user.location_point || ''; // Ensure location_point is defined
              return locationPoint.trim().toLowerCase() === id.trim().toLowerCase(); // Case-insensitive comparison
            })
          : response.documents;

        console.log(filteredUsers); // To check structure of the filtered data
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchGoneUsers();
  }, [id]); // Add 'id' to dependency array

  return (
    <div className="p-4 text-white">
      <h4 className="text-lg font-semibold mb-3 text-white bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-md text-xl shadow-lg">
        🐠 Users Gone for Fish Shoals
      </h4>

      {users.length === 0 ? (
        <p className="text-sm text-gray-300 italic">No users yet.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.$id} className="p-3 bg-white/10 rounded-lg shadow-sm hover:bg-white/20 transition-all">
              {/* Display user name, email, and phone */}
              <p className="text-sm font-light "><span className="font-medium">👤 User Name:</span> {user.user_name || 'N/A'}</p>
              <p className="text-sm font-light "><span className="font-medium">📧 Email:</span> {user.user_email || 'N/A'}</p>
              <p className="text-sm font-light "><span className="font-medium">📱 Phone Number:</span> {user.user_phone || 'N/A'}</p>
              <p className="text-sm font-light "><span className="font-medium">📍 Location Point:</span> {user.location_point}</p>
              <p className="text-xs mt-1 ">🕒 {user.$createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserGone;
