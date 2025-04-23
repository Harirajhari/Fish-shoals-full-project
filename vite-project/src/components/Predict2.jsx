import React, { useState } from "react";
import { account, databases } from "../appwrite";
import UserGone from "./UserGone";

// richardson bay_rock_1

//month/date/year

const dataset = {
    "bocas del toro_almirante": {
        location: "bocas",
        site: "almirante",
        date: "1/27/2016"
    },
    "bocas del toro_bocas town": {
        location: "bocas",
        site: "bocas town",
        date: "2/1/2016"
    },
    "bocas del toro_carinero": {
        location: "bocas",
        site: "carinero",
        date: "2/1/2016"
    },
    "bocas del toro_san cristobal": {
        location: "bocas",
        site: "san cristobal",
        date: "1/29/2016"
    },
    "bocas del toro_stri": {
        location: "bocas",
        site: "stri",
        date: "2/1/2016, 1/28/2016"
    },
    "ft pierce_avalon": {
        location: "sms",
        site: "avalon",
        date: "9/30/2015"
    },
    "ft pierce_jack island": {
        location: "sms",
        site: "jack island",
        date: "9/29/2015, 9/29/2015"
    },
    "ft pierce_sms": {
        location: "sms",
        site: "sms",
        date: "9/29/2015, 10/1/2015"
    },
    "ft pierce_turner cove": {
        location: "sms",
        site: "turner cove",
        date: "9/28/2015"
    },
    "ft pierce_wildcat cova": {
        location: "sms",
        site: "wildcat cova",
        date: "9/28/2015"
    },
    "rhode river_big island": {
        location: "rr",
        site: "big island",
        date: "8/19/2015"
    },
    "rhode river_cadle creek": {
        location: "rr",
        site: "cadle creek",
        date: "8/12/2015"
    },
    "rhode river_dock mud": {
        location: "rr",
        site: "dock mud",
        date: "9/1/2015"
    },
    "rhode river_high island": {
        location: "rr",
        site: "high island",
        date: "8/12/2015"
    },
    "rhode river_inner rhode river": {
        location: "rr",
        site: "inner rhode river",
        date: "8/12/2015"
    },
    "rhode river_middle rhode river": {
        location: "rr",
        site: "middle rhode river",
        date: "8/12/2015"
    },
    "rhode river_mouth mud": {
        location: "rr",
        site: "mouth mud",
        date: "9/1/2015"
    },
    "rhode river_muddy creek": {
        location: "rr",
        site: "muddy creek",
        date: "8/19/2015"
    },
    "rhode river_outer rhode river": {
        location: "rr",
        site: "outer rhode river",
        date: "8/12/2015"
    },
    "rhode river_selman creek": {
        location: "rr",
        site: "selman creek",
        date: "9/11/2015"
    },
    "richardson bay_docks_1": {
        location: "rb",
        site: "docks_1",
        date: "6/15/2015"
    },
    "richardson bay_docks_2": {
        location: "rb",
        site: "docks_2",
        date: "6/15/2015"
    },
    "richardson bay_docks_3": {
        location: "rb",
        site: "docks_3",
        date: "6/15/2015"
    },
    "richardson bay_rock_1": {
        location: "rb",
        site: "rock_1",
        date: "6/15/2015"
    },
    "richardson bay_seagrass_1": {
        location: "rb",
        site: "seagrass_1",
        date: "6/16/2015"
    },
    "richardson bay_seagrass_2": {
        location: "rb",
        site: "seagrass_2",
        date: "6/16/2015"
    },
    "richardson bay_seagrass_3": {
        location: "rb",
        site: "seagrass_3",
        date: "6/16/2015"
    },
    "richardson bay_soft_sed_1": {
        location: "rb",
        site: "soft_sed_1",
        date: "6/15/2015"
    },
    "richardson bay_soft_sed_2": {
        location: "rb",
        site: "soft_sed_2",
        date: "6/15/2015"
    },
    "richardson bay_soft_sed_3": {
        location: "rb",
        site: "soft_sed_3",
        date: "6/16/2015"
    },

};

const Predict2 = () => {
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [site, setSite] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [id, setId] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false); // Modal visibility
    const [predictionDocId, setPredictionDocId] = useState(null); // Store the document ID for updating
    console.log(predictionDocId);
    

    const handlePredict = async () => {
        try {
            // Lookup in dataset using ID
            const matched = dataset[id];

            if (!matched) {
                alert("Invalid ID. Please enter a valid one.");
                return;
            }

            const matchedLocation = matched.location;
            const matchedSite = matched.site;

            setSite(matchedSite);

            // Check session
            const user = await account.get();

            // Get JWT
            const jwtResponse = await account.createJWT();
            const token = jwtResponse.jwt;

            const response = await fetch("http://127.0.0.1:8000/predict2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ date, location: matchedLocation, site: matchedSite }),
            });

            const data = await response.json();

            if (response.ok) {
                setPrediction(data);

                // Save to Appwrite DB
                const savedDoc  = await databases.createDocument(
                    "67f2ac870008dbcea22e", // DB ID
                    "67f2acb300265425e43a", // Collection ID
                    "unique()",
                    {
                        user_id: user.$id,
                        date: data.date,
                        location: matchedLocation,
                        predicted_site: matchedSite,
                        predicted_habitat: data.predicted_habitat,
                        predicted_number_of_fish_shoals: String(data.predicted_number_of_fish_shoals),
                        Location_point: id,
                    }
                );

                setPredictionDocId(savedDoc.$id);

            } else {
                alert(data.detail || "Prediction failed!");
            }
        } catch (err) {
            console.error("Prediction2 error:", err);
        }
    };

    
    const handleConfirmAction = async() => {

        await databases.updateDocument(
            "67f2ac870008dbcea22e", // DB ID
            "67f2acb300265425e43a", // Collection ID
            predictionDocId,        // You must store and pass this ID
            {
                active_tag: true
            }
        );


        const user = await account.get(); // gets the logged-in user's details
        const data = {
            user_id: user.$id,
            user_name: user.name,
            user_email: user.email,
            user_phone: user.phone || "N/A", // Optional chaining
            location_point: id,

        };

        const response = await databases.createDocument(
            "67f2ac870008dbcea22e", // database ID
            "67f9c0c4001fc79babf0", // collection ID
            "unique()",             // document ID (auto-generate)
            data
        );

        alert("Fish shoal prediction stored successfully!");
        setShowConfirmation(false); // Close the confirmation modal
    };

    const handleCancelAction = () => {
        setShowConfirmation(false); // Close the confirmation modal
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 p-6">
            <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/30">
                <h2 className="text-3xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
                    🐟 Predict Fish Habitat & Shoals
                </h2>
                <div className="space-y-5">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        max="2016-12-31"
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                    />

                    <input
                        type="text"
                        placeholder="Enter ID (e.g., bocas del toro_almirante_mangrove_3)"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-400 rounded-lg bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                    />

                    <button
                        onClick={handlePredict}
                        className={`w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600 text-white py-3 rounded-lg font-bold shadow-lg transition duration-300 transform hover:scale-105 ${!id || !date ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!id || !date}
                    >
                        🔮 Predict
                    </button>
                </div>

                {prediction && (
    <div className="mt-8 p-6 bg-white/20 border border-white/30 rounded-2xl shadow-2xl text-white backdrop-blur-md transition duration-300 hover:shadow-3xl">
        <h3 className="text-2xl font-semibold text-center text-white mb-6 drop-shadow-md">
            📊 Prediction Results
        </h3>

        <div className="space-y-4 text-base">
            <div className="flex justify-between items-center">
                <span className="font-medium">📍 Location Point:</span>
                <span className="text-right">{id}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">🗺️ Location:</span>
                <span className="text-right">{prediction.location}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">📅 Date:</span>
                <span className="text-right">{prediction.date}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">🧪 Input Site:</span>
                <span className="text-right">{site}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">🌿 Predicted Habitat:</span>
                <span className="text-right">{prediction.predicted_habitat}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium">🐟 Fish Shoals:</span>
                <span className="text-right">{prediction.predicted_number_of_fish_shoals}</span>
            </div>
        </div>

        {/* UserGone section */}
        <div className="mt-6">
        <UserGone id={id} />
        </div>

        {/* Confirmation Button */}
        <button
            onClick={() => setShowConfirmation(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl mt-6 transition-transform transform hover:scale-105 shadow-lg"
        >
            🔮 Get Fish Shoals
        </button>
    </div>
)}



                {/* Confirmation Modal */}
                {showConfirmation && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to proceed?</h3>
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleConfirmAction}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Yes
                </button>
                <button
                    onClick={handleCancelAction}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                    No
                </button>
            </div>

           
        </div>
    </div>
)}


            </div>
        </div>
    );
};

export default Predict2;
