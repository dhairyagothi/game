import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PointsBoard = () => {
  // Extract teamName from route parameters.
  const { teamName } = useParams();
  const [timeLeft, setTimeLeft] = useState(0);
  const [basePoints, setBasePoints] = useState(0);
  const [accumulatedBonus, setAccumulatedBonus] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [myRank, setMyRank] = useState(null);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  // Fetch the final game status from the backend.
  useEffect(() => {
    const fetchFinalStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/game-status");
        const fetchedTimeLeft = res.data.timeLeft;
        const fetchedPoints = res.data.points;
        const bonus = res.data.accumulatedBonus;
        const totalScore = fetchedPoints + bonus;

        setTimeLeft(fetchedTimeLeft);
        setBasePoints(fetchedPoints);
        setAccumulatedBonus(bonus);
        setFinalScore(totalScore);
      } catch (error) {
        console.error("Error fetching final status:", error);
      }
    };

    fetchFinalStatus();
  }, []);

  // Fetch leaderboard data from MongoDB.
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/leaderboard");
        const leaderboard = res.data.leaderboard; // assuming this is sorted in descending order by score
        setPlayers(leaderboard);

        // Compute rank: count how many teams have a higher score than the current finalScore.
        const rank = leaderboard.filter(player => player.score > finalScore).length + 1;
        setMyRank(rank);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    // Run after finalScore is set.
    if (finalScore !== 0) {
      fetchLeaderboard();
    }
  }, [finalScore]);

  // Play Again: Reset game state in the backend and navigate to the home/start page.
  const handlePlayAgain = async () => {
    try {
      await axios.post("http://localhost:5000/reset-game", { teamName });
      navigate("/");
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      <p className="text-xl mb-2">Team: {teamName}</p>
      <p className="text-xl mb-2">Base Points: {basePoints}</p>
      <p className="text-xl mb-2">Time Left: {timeLeft} seconds</p>
      <p className="text-xl mb-2">Accumulated Time Bonus: {accumulatedBonus} points</p>
      <h2 className="text-3xl font-bold mb-2">Final Score: {finalScore}</h2>
      <p className="text-xl mb-4">
        Your Rank: {myRank !== null ? myRank : "Calculating..."}
      </p>
      <button
        onClick={handlePlayAgain}
        className="mt-6 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Play Again
      </button>
    </div>
  );
};

export default PointsBoard;
