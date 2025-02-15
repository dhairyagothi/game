import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../../assets/lroom.jpeg"; // Change to your desired background

const PuzzleSceneWithArrows = () => {
  const [inventory, setInventory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null); // initialize with null instead of 0
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  // Poll the backend every second to update timer and points
  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/game-status");
        setTimeLeft(response.data.timeLeft);
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };

    fetchGameStatus();
    const interval = setInterval(fetchGameStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if timer has reached 0 and then navigate to leaderboard
  useEffect(() => {
    // Only navigate if timeLeft has been set (i.e. not null)
    if (timeLeft !== null && timeLeft === 0) {
      navigate("/leaderboard", { state: { previousGame: "game1", currentScore: points } });
    }
  }, [timeLeft, points, navigate]);

  // Optionally, fetch current inventory if needed
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/items");
        setInventory(response.data.items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  const handlePolishedKey = async () => {
    try {
      const payload = {
        name: "Polished Key",
        description: "A shiny, polished key that seems to unlock something important.",
        foundBy: "Player"
      };
      await axios.post("http://localhost:5000/items", payload);
      alert("You found the Polished Key!");
    } catch (error) {
      console.error("Error posting Polished Key:", error);
    }
  };

  const handleLetter = async () => {
    try {
      const payload = {
        name: "Letter",
        description: "An old, mysterious letter with cryptic messages.",
        foundBy: "Player"
      };
      await axios.post("http://localhost:5000/items", payload);
      alert("You found a Letter!");
    } catch (error) {
      console.error("Error posting Letter:", error);
    }
  };

  // Navigation functions for arrows (do not reset timer/points/inventory)
  const navigateToGame1 = () => {
    navigate("/games/game1");
  };

  const navigateToGame11 = () => {
    navigate("/games/game11");
  };

  return (
    <div
      className="scene-container"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Timer and Points Display */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "#fff",
          fontSize: "18px",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "5px",
          borderRadius: "5px",
          zIndex: 2
        }}
      >
        <p>Time Left: {timeLeft !== null ? `${timeLeft}s` : "Loading..."}</p>
        <p>Points: {points}</p>
      </div>

      {/* Title */}
      <h1
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#fff",
          fontSize: "2rem",
          zIndex: 2
        }}
      >
        Puzzle Scene
      </h1>

      {/* Clickable Div for Polished Key */}
      <div
        onClick={handlePolishedKey}
        style={{
          position: "absolute",
          left: "25%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "20px",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
          zIndex: 2
        }}
      >
        <h2>Polished Key</h2>
      </div>

      {/* Clickable Div for Letter */}
      <div
        onClick={handleLetter}
        style={{
          position: "absolute",
          right: "25%",
          top: "50%",
          transform: "translate(50%, -50%)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "20px",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "center",
          zIndex: 2
        }}
      >
        <h2>Letter</h2>
      </div>

      {/* Left Arrow Navigation to Game1 */}
      <div
        onClick={navigateToGame11}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "2rem",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "50%",
          zIndex: 2
        }}
      >
        ←
      </div>

      {/* Right Arrow Navigation to Game11 */}
      <div
        onClick={navigateToGame1}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "2rem",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "50%",
          zIndex: 2
        }}
      >
        →
      </div>
    </div>
  );
};

export default PuzzleSceneWithArrows;
