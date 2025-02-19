import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bg from './../../assets/story3bg.jpg';
import gun from './../../assets/gun.png';
import mirror from './../../assets/hint2story3.png';
import clock from './../../assets/hint3story3.png';

// Mapping for items to be found
const itemsMapping = {
  item1: "The Display Case",
  item2: "The Mirror",
  item3: "The Clock",
  item4: "The Chest",
  item5: "The Pistol"
};

// Define positions and sizes for each clickable item (adjust as needed)
const clickableStyles = {
  item1: { top: "55%", left: "23%", width: "100px", height: "80px" },
  item2: { top: "30%", left: "51%", width: "80px", height: "80px" },
  item3: { top: "20%", right: "12%", width: "80px", height: "80px" },
  item4: { top: "52%", left: "50%", width: "48px", height: "30px" },
  item5: { top: "70%", left: "60%", width: "80px", height: "80px" },
};

const Game3 = () => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds (from backend)
  const [points, setPoints] = useState(0);
  const [clickedItems, setClickedItems] = useState([]);
  const [inventory, setInventory] = useState([]); // backend inventory
  const navigate = useNavigate();

  // Start game when component mounts
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

  // Poll the backend every second to update time left and points
  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/game-status");
        setTimeLeft(response.data.timeLeft);
        setPoints(response.data.points);
        if (response.data.timeLeft <= 0 || inventory.length==5) {
          navigate("/leaderboard", { state: { previousGame: "game3", currentScore: points } });
        }
      } catch (error) {
        console.error("Error fetching game status", error);
      }
    };

    const interval = setInterval(fetchGameStatus, 1000);
    return () => clearInterval(interval);
  }, [inventory,navigate]);

  // Fetch the inventory from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setInventory(response.data.items);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  // Get inventory on mount and whenever items are updated
  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle a click on a game item:
  // If the item hasn’t been found yet, call the backend to add it,
  // then update local clickedItems, points, and inventory.
  const handleClick = async (item) => {
    if (!clickedItems.includes(item)) {
      try {
        const payload = {
          name: itemsMapping[item],
          description: `Found ${itemsMapping[item]} in Game3`,
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

  // Helper to format the remaining time as mm:ss
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
            <li
              key={key}
              style={{
                textDecoration: clickedItems.includes(key) ? 'line-through' : 'none'
              }}
            >
              {itemsMapping[key]}
            </li>
          ))}
        </ul>
      </div>

      {/* Background with Clickable Areas */}
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
                ...clickableStyles[item]
              }}
            >
              {item === 'item2' ? (
  <img
    src={mirror}
    alt="mirror"
    className="w-full h-full"
    style={{ filter: 'grayscale(100%)' ,opacity:0.5}}
  />
) : item === 'item3' ? (
  <img
    src={clock}
    alt="clock"
    className="w-full h-full"
    style={{ filter: 'grayscale(100%)' ,opacity:0.5}}
  />
) : item === 'item5' ? (
  <img
    src={gun}
    alt="pistol"
    className="w-full h-full"
    style={{ filter: 'grayscale(10%)',opacity:0.5 }}
  />
) : (
  null
)}

            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Game3;
