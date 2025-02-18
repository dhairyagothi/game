import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinalScore = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [basePoints, setBasePoints] = useState(0);
  const [accumulatedBonus, setAccumulatedBonus] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const navigate = useNavigate();

  // Fetch the final game status from the backend
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

  const handlePlayAgain = async () => {
    // Optionally, reset the game
    await axios.post("http://localhost:5000/reset-game");
    // Navigate to the starting page (adjust as needed)
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      <p className="text-xl mb-2">Base Points: {basePoints}</p>
      <p className="text-xl mb-2">Accumulated Time Bonus: {accumulatedBonus} points</p>
      <h2 className="text-3xl font-bold mb-4">Final Score: {finalScore}</h2>
      <button
        onClick={handlePlayAgain}
        className="mt-6 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Play Again
      </button>
    </div>
  );
};

export default FinalScore;
