import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bg from './../../assets/game2combined.jpg';

// Mapping for items to be found in Game2
const itemsMapping = {
  item1: "Torn Masquerade Mask",
  item2: "Poisoned Goblet",
  item3: "Broken Pocket Watch",
  item4: "Blackmail Letter",
  item5: "Key in Loose Floorboard"
};

// Define positions and sizes for each clickable item (adjust as needed)
const clickableStyles = {
  item1: { top: "45%", right: "35%", width: "60px", height: "60px" },
  item2: { top: "37%", left: "50%", width: "50px", height: "50px" },
  item3: { top: "65%", right: "75%", width: "70px", height: "70px" },
  item4: { top: "75%", left: "80%", width: "60px", height: "60px" },
  item5: { top: "75%", left: "59%", width: "20px", height: "50px" },
};

const Game2 = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds (from backend)
  const [points, setPoints] = useState(0);
  const [clickedItems, setClickedItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  // Start the game on mount (this initializes the backend game state)
  useEffect(() => {
    const startGame = async () => {
      try {
        const response = await axios.post("http://localhost:5000/start-game");
        setTimeLeft(response.data.timeLeft);
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error starting game", error);
      }
    };
    startGame();
  }, []);

  // Poll the backend every second for game status (time left and points)
  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/game-status");
        setTimeLeft(response.data.timeLeft);
        setPoints(response.data.points);
        if (response.data.timeLeft <= 0 || response.data.points==140) {
          navigate('/leaderboard', { state: { previousGame: "game2", currentScore: response.data.points } });
        }
      } catch (error) {
        console.error("Error fetching game status", error);
      }
    };

    const interval = setInterval(fetchGameStatus, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Fetch the inventory from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setInventory(response.data.items);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  // Fetch inventory on mount and whenever items are updated
  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle clicking on an item
  const handleClick = async (item) => {
    if (!clickedItems.includes(item)) {
      try {
        const payload = {
          name: itemsMapping[item],
          description: `Found ${itemsMapping[item]} in Game2`,
          foundBy: "Player"
        };
        const response = await axios.post("http://localhost:5000/items", payload);
        setClickedItems(prev => [...prev, item]);
        setPoints(response.data.points); // update points from backend response
        fetchInventory(); // refresh inventory from backend
      } catch (error) {
        console.error("Error posting item", error);
      }
    }
  };

  // Helper to format remaining time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen relative bg-black text-white">
      {/* Timer and Points Display */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 p-2 rounded">
        <p>Time Left: {formatTime(timeLeft)}</p>
        <p>Points: {points}</p>
      </div>

      {/* Inventory Display (Found Items) */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded">
        <h4>Inventory (Found Items):</h4>
        <ul>
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      {/* Items to Find List */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-2 rounded">
        <h4>Items to Find:</h4>
        <ul>
          {Object.keys(itemsMapping).map(key => (
            <li key={key} style={{ textDecoration: clickedItems.includes(key) ? 'line-through' : 'none' }}>
              {itemsMapping[key]}
            </li>
          ))}
        </ul>
      </div>

      {/* Background Image with Clickable Areas */}
      <div
        className="relative mx-auto"
        style={{
          width: "900px",
          height: "650px",
          backgroundImage: `url(${bg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      >
        {Object.keys(itemsMapping).map(item => (
          !clickedItems.includes(item) && (
            <div
              key={item}
              onClick={() => handleClick(item)}
              style={{
                position: "absolute",
                cursor: "pointer",
                ...clickableStyles[item]
              }}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Game2;
