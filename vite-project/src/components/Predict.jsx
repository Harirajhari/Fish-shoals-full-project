import React, { useState, useEffect } from "react";
import { account, databases  } from "../appwrite";

const Predict = () => {
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [prediction, setPrediction] = useState(null);

    console.log(prediction);
    

    const handlePredict = async () => {
        try {
            // ✅ Check if the user has a session
            const user = await account.get();
            console.log("User session active:", user);

            // ✅ Now get JWT
            const jwtResponse = await account.createJWT();
            const token = jwtResponse.jwt;

            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ date, location }),
            });

            const data = await response.json();

            if (response.ok) {
                setPrediction(data);

                // Save to Appwrite database
            await databases.createDocument(
                "67f2ac870008dbcea22e", // replace with your actual DB ID
                "67f2acb300265425e43a",      // your collection ID
                "unique()",         // auto ID
                {
                    user_id: user.$id,
                    date: data.date,
                    location: data.location,
                    predicted_site: data.predicted_site,
                    predicted_habitat: data.predicted_habitat,
                    predicted_number_of_fish_shoals: String(data.predicted_number_of_fish_shoals),
                }
            );
            } else {
                alert(data.detail || "Prediction failed!");
            }
        } catch (err) {
            console.error("JWT or session error:", err);
            alert("You must be logged in to make predictions.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 p-6">
            <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/30">
                <h2 className="text-3xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
                    🎣 Fish Population Prediction
                </h2>
                <div className="space-y-5">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                    />
                    <input
                        type="text"
                        placeholder="Enter Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                    />
                    <button
                        onClick={handlePredict}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        🔍 Predict
                    </button>
                </div>

                {prediction && (
                    <div className="mt-8 p-6 bg-white/20 border border-white/40 rounded-xl shadow-lg text-white backdrop-blur-md transition duration-300 hover:shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 drop-shadow-md">📊 Prediction Result:</h3>
                        <p className="text-lg"><strong> Location:</strong> {prediction.location}</p>
                        <p className="text-lg"><strong> Date:</strong> {prediction.date}</p>
                        <p className="text-lg"><strong> Predicted Site:</strong> {prediction.predicted_site}</p>
                        <p className="text-lg"><strong> Predicted Habitat:</strong> {prediction.predicted_habitat}</p>
                        <p className="text-lg"><strong> Fish Shoals:</strong> {prediction.predicted_number_of_fish_shoals}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predict;
