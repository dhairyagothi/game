import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Leaderboard = ({ players = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the previous game indicator from the router state.
  // For example, when navigating to Leaderboard, you might send: { previousGame: "game1" }.
  const previousGame = location.state?.previousGame || "default";
  
  // Determine next route based on where we came from.
  let nextRoute = "/games/game1"; // default (if needed)
  if (previousGame === "game11" || previousGame === "game1") {
    nextRoute = "/games/game2";
  } else if (previousGame === "game2") {
    nextRoute = "/games/game3";
  }
  
  // State to store current player's score and number of items found.
  const [currentScore, setCurrentScore] = useState(0);
  const [currentItemsFound, setCurrentItemsFound] = useState(0);

  // Fetch current score and items from the backend.
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/game-status");
        setCurrentScore(response.data.points);
        setCurrentItemsFound(response.data.hintsFound);
      } catch (error) {
        console.error("Error fetching current status:", error);
      }
    };

    fetchCurrentStatus();
  }, []);

  const handleNextLevel = async () => {
    try {
      // Call the backend endpoint to reset only the timer (without changing points)
      await axios.post("http://localhost:5000/restart-timer");
      // Now navigate to the next level, passing along the identifier if needed.
      navigate(nextRoute, { state: { previousGame: nextRoute.split("/").pop() } });
    } catch (error) {
      console.error("Error restarting timer", error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[url('https://media.istockphoto.com/id/837345268/photo/noir-movie-character.jpg?s=612x612&w=0&k=20&c=WGaAh-xWelYuEoxhUE69T4e4k45Bp-MTC6KLG7edN8Y=')] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center">
      <div className="bg-black text-gray-300 p-6 rounded-lg shadow-lg max-w-xl w-full mx-4 border border-gray-700">
        <h1 className="text-red-600 text-3xl font-bold text-center mb-4 drop-shadow-md">
          Leaderboard
        </h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-600 text-left">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Player</th>
              <th className="py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <tr
                  key={player.id || index}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{player.name}</td>
                  <td className="py-2 px-4">{player.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center" colSpan="3">
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Summary Section */}
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <p className="text-xl mb-2">Your Score: {currentScore}</p>
          <p className="text-xl mb-4">Items Found: {currentItemsFound}</p>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleNextLevel}
          >
            Next Level
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
