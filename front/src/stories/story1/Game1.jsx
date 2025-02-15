import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { motion } from "framer-motion";
import axios from "axios";
import libraryImage from "../../assets/normal.jpg"; // Default with frame
import frameRemovedImage from "../../assets/no_frame.png"; // No frame
import frameRemovedLightOffImage from "../../assets/code.png"; // No frame, light off
import blackImage from "../../assets/black.png"; // Light off, frame still there

const LibraryScene = () => {
  const [frameRemoved, setFrameRemoved] = useState(false);
  const [lightOff, setLightOff] = useState(false);
  const [lockVisible, setLockVisible] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [inventory, setInventory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  // On mount, initialize or retrieve current game state.
  useEffect(() => {
    axios
      .post("http://localhost:5000/start-game")
      .then((res) => {
        setTimeLeft(res.data.timeLeft);
        console.log(res.data.timeLeft)
        setPoints(res.data.points);
      })
      .catch((err) => console.error("Error starting game:", err));

    // Poll /game-status every second to update time and points.
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/game-status")
        .then((res) => {
          setTimeLeft(res.data.timeLeft);
          setPoints(res.data.points);
        })
        .catch((err) => console.error("Error fetching game status:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Redirect to leaderboard if timer runs out.
  useEffect(() => {
    axios
        .get("http://localhost:5000/game-status")
        .then((res) => {
          setTimeLeft(res.data.timeLeft);
          setPoints(res.data.points);
        })
        .catch((err) => console.error("Error fetching game status:", err));
    console.log(timeLeft)
    if (timeLeft === 0) {
      navigate("/leaderboard", { state: { previousGame: "game1", currentScore: points } });
    }
  }, [timeLeft, points, navigate]);

  // Fetch inventory on mount.
  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((res) => setInventory(res.data.items))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  const handleInput = (digit) => {
    if (code.length < 4) {
      setCode(code + digit);
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
  };

  const handleUnlock = () => {
    if (code === "2431") {
      setLockVisible(false);
      setError("");

      // Send found item to backend.
      const newItem = {
        name: "Torn Journal Page",
        description: "A torn page from Albert’s journal.",
      };
      axios
        .post("http://localhost:5000/items", newItem)
        .then((res) => {
          // Update inventory with the new item and update points from the backend.
          setInventory([...inventory, res.data.item]);
          setPoints(res.data.points);
          alert("✅ Lock Opened! You found a torn journal page. (+10 Points)");
        })
        .catch((err) => console.error("Error posting item:", err));
    } else {
      setError("❌ Incorrect Code. Try Again!");
      setCode("");
    }
  };

  // Helper function to format seconds as mm:ss.
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getImageSrc = () => {
    if (!frameRemoved && lightOff) return blackImage;
    if (frameRemoved && lightOff) return frameRemovedLightOffImage;
    if (frameRemoved) return frameRemovedImage;
    return libraryImage;
  };

  return (
    <div className="scene-container">
      <div className="game-status">
        <p>⏳ Time Left: {formatTime(timeLeft)}</p>
        <p>⭐ Points: {points}</p>
      </div>

      <div className="inventory">
        <h3>Inventory</h3>
        <ul>
          {inventory.length > 0 ? (
            inventory.map((item, index) => <li key={index}>{item.name}</li>)
          ) : (
            <li>No items found</li>
          )}
        </ul>
      </div>

      <motion.img
        key={getImageSrc()}
        src={getImageSrc()}
        alt="Library Scene"
        className="library-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {!frameRemoved && (
        <div
          className="frame-click-area"
          onClick={() => setFrameRemoved(true)}
        ></div>
      )}
      <div
        className="light-click-area"
        onClick={() => setLightOff(!lightOff)}
      ></div>
      <div
        className="cabinet-click-area"
        onClick={() => setLockVisible(true)}
      ></div>

      {lockVisible && (
        <div className="lock-container">
          <div className="lock-body">
            <p className="lock-text">{code || "----"}</p>
          </div>

          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                className="num-btn"
                onClick={() => handleInput(num.toString())}
              >
                {num}
              </button>
            ))}
            <button className="delete-btn" onClick={handleDelete}>
              ←
            </button>
            <button className="unlock-btn" onClick={handleUnlock}>
              Unlock
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
          <button
            onClick={() => setLockVisible(false)}
            className="close-lock-btn"
          >
            Close
          </button>
        </div>
      )}
      <div
        onClick={() => navigate("/games/game11")}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "2rem",
          color: "#fff",
          zIndex: 2,
        }}
      >
        →
      </div>
    </div>
  );
};

export default LibraryScene;
