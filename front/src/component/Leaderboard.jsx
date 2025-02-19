import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the previous game indicator from router state.
  const previousGame = location.state?.previousGame || "default";
  
  // Determine next route based on previous game.
  let nextRoute = "/games/game1"; // default (if needed)
  if (previousGame === "game11" || previousGame === "game1") {
    nextRoute = "/story2intro";
  } else if (previousGame === "game2") {
    nextRoute = "/story3intro";
  } else if (previousGame === "game3") {
    nextRoute = "/story4intro";
  }
  
  // State for leaderboard entries.
  const [players, setPlayers] = useState([]);
  // State to store current team's score.
  const [currentScore, setCurrentScore] = useState(0);
  const [currentItemsFound, setCurrentItemsFound] = useState(0);
  // State to store the computed rank based on currentScore.
  const [myRank, setMyRank] = useState(null);

  // Fetch leaderboard data from MongoDB.
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/leaderboard");
        // Assuming response.data.leaderboard is an array sorted descending by score.
        setPlayers(response.data.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // Fetch current game status from backend.
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/game-status");
        setCurrentScore(response.data.points);
        setCurrentItemsFound(response.data.hintsFound);
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };
    fetchCurrentStatus();
  }, []);

  // Compute current team's rank by comparing currentScore with leaderboard scores.
  useEffect(() => {
    if (players.length > 0) {
      // Count how many players have a higher score than currentScore.
      const rank = players.filter(player => player.score > currentScore).length + 1;
      setMyRank(rank);
    }
  }, [players, currentScore]);

  const handleNextLevel = () => {
    navigate(nextRoute, {
      state: { previousGame: nextRoute.split("/").pop() },
    });
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
                  key={player._id || index}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{player.teamName}</td>
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
          <p className="text-xl mb-2">Items Found: {currentItemsFound}</p>
          <p className="text-xl mb-4">
            Your Rank: <span className="font-bold">{myRank !== null ? myRank : "Calculating..."}</span>
          </p>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() =>
              navigate(nextRoute, {
                state: { previousGame: nextRoute.split("/").pop() },
              })
            }
          >
            Next Level
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
