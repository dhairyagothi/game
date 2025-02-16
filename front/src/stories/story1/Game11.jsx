import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "../../assets/sroom.jpeg";
import { useNavigate } from "react-router-dom";
const MysteryGame = () => {
  const [showLock, setShowLock] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [points, setPoints] = useState(0);
  const [inventory, setInventory] = useState([]);
   const navigate = useNavigate();
  // Helper function to format seconds as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // On mount, initialize or retrieve current game state and start polling game status.
  useEffect(() => {
    // Initialize game or get current state (won't reset timer if game already started)
    axios
      .post("http://localhost:5000/start-game")
      .then((res) => {
        setTimeLeft(res.data.timeLeft);
        setPoints(res.data.points);
      })
      .catch((err) => console.error("Error starting game:", err));

    // Poll the game-status endpoint every second.
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/game-status")
        .then((res) => {
          setTimeLeft(res.data.timeLeft);
          setPoints(res.data.points);
        })
        .catch((err) => console.error("Error fetching game status", err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch inventory on mount.
  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((res) => setInventory(res.data.items))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);
  useEffect(() => {
      if (timeLeft === 0 || points==70) {
        navigate("/leaderboard", { state: { previousGame: "game1", currentScore: points } });
      }
    }, [timeLeft, points, navigate]);
  const handleDivClick = () => {
    setShowLock(true);
  };

  const handleUnlock = async () => {
    if (enteredCode === "0755" && !isUnlocked) {
      setIsUnlocked(true);
      try {
        // Send the proper payload to add the key
        await axios.post("http://localhost:5000/items", { 
          name: "Small Rusted Key", 
          description: "A small rusted key found behind the lock." 
        });
        // Update points from game status
        const statusResponse = await axios.get("http://localhost:5000/game-status");
        setPoints(statusResponse.data.points);
        // Refresh inventory after adding the new item
        const inventoryResponse = await axios.get("http://localhost:5000/items");
        setInventory(inventoryResponse.data.items);
      } catch (error) {
        console.error("Error updating inventory or points", error);
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Timer and Points Display */}
      <div style={{ position: "absolute", top: "10px", left: "10px", color: "#fff", fontSize: "18px" }}>
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Points: {points}</p>
      </div>

      {/* Inventory Display */}
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "10px",
          color: "#fff",
          fontSize: "16px",
          background: "rgba(0,0,0,0.5)",
          padding: "5px",
          borderRadius: "4px",
        }}
      >
        <h4>Inventory:</h4>
        {inventory.length > 0 ? (
          <ul>
            {inventory.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* Translucent Clickable Div */}
      <div
        onClick={handleDivClick}
        style={{
          position: "absolute",
          top: "57%",
          left: "27%",
          width: "90px",
          height: "80px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          cursor: "pointer",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      />

      {/* Number Lock UI */}
      {showLock && !isUnlocked && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            borderRadius: "8px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <p>Enter the 4-digit code:</p>
          <input
            type="text"
            maxLength="4"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            style={{ padding: "5px", fontSize: "18px" }}
          />
          <button onClick={handleUnlock} style={{ marginLeft: "10px", padding: "5px 10px" }}>
            Unlock
          </button>
        </div>
      )}
      <div
        onClick={() => navigate("/games/game1")}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          transform: "translatex(50%)",
          cursor: "pointer",
          fontSize: "2rem",
          color: "#fff",
          zIndex: 2,
        }}
      >
        ←
      </div>
      <div
        onClick={() => navigate("/games/game12")}
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

export default MysteryGame;
