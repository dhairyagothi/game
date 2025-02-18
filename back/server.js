const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage
let foundItems = [];
let points = 0;
let accumulatedBonus = 0; // Accumulates bonus from remaining time in each level
let gameStarted = false;
let timerEndTime = null;
const MAX_HINTS = 5;

// Start Game & Timer (Always resets to 5 minutes)
app.post("/start-game", (req, res) => {
  if (!gameStarted) {
    // Start a new game with a 5-minute timer.
    gameStarted = true;
    timerEndTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    foundItems = [];
    points = 0;
    accumulatedBonus = 0;
    res.json({ message: "Game started!", timeLeft: 300, points });
  } else {
    // Game is already in progress—calculate and return the current state.
    const timeLeft = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
    res.json({ message: "Game already in progress", timeLeft, points });
  }
});

// Get Time Left & Points
app.get("/game-status", (req, res) => {
  const timeLeft = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
  res.json({
    timeLeft,
    points,
    hintsFound: foundItems.length,
    accumulatedBonus,
    finalScore: points + accumulatedBonus
  });
});

// GET all found items (Inventory)
app.get("/items", (req, res) => {
  res.json({ items: foundItems });
});

// Add a Found Hint
app.post("/items", (req, res) => {
  if (!gameStarted)
    return res.status(400).json({ message: "Game not started!" });

  const { name, description, foundBy } = req.body;
  if (foundItems.length < MAX_HINTS) {
    const newItem = { id: foundItems.length + 1, name, description, foundBy };
    foundItems.push(newItem);
    points += 10;

    if (foundItems.length === MAX_HINTS) {
      points += 20; // Bonus for finding all hints in the level
    }

    res.json({ message: "Hint added!", item: newItem, points, hintsFound: foundItems.length });
  } else {
    res.json({ message: "All hints already found!" });
  }
});

// Reset Game
app.post("/reset-game", (req, res) => {
  gameStarted = false;
  foundItems = [];
  points = 0;
  accumulatedBonus = 0;
  timerEndTime = null;
  res.json({ message: "Game reset!" });
});

// Restart Timer Without Resetting Points (and accumulate time bonus)
app.post("/restart-timer", (req, res) => {
  if (!gameStarted) {
    // If no game is running, start one with a 5-minute timer.
    gameStarted = true;
    timerEndTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    res.json({ message: "Game started!", timeLeft: 300, points });
  } else {
    // Calculate bonus for the current level: 5 points per 30 seconds remaining
    const currentTimeLeft = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
    const bonusForLevel = Math.floor(currentTimeLeft / 30) * 5;
    accumulatedBonus += bonusForLevel;
    
    // Reset timer to 5 minutes without changing points
    timerEndTime = Date.now() + 5 * 60 * 1000;
    res.json({ message: "Timer restarted!", timeLeft: 300, points, accumulatedBonus });
  }
});

// Reset Inventory Without Resetting Points
app.post("/reset-inventory", (req, res) => {
  foundItems = [];
  res.json({ message: "Inventory reset", points });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
