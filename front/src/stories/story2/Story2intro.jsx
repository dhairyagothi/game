import React from "react";
import "./story2.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "./../../assets/story2themebg.png";

const Story2 = () => {
  const navigate = useNavigate();

  const handleNextLevel = async () => {
    try {
      // Call the endpoint to reset the timer (without changing points)
      await axios.post("http://localhost:5000/restart-timer");
      // Now reset the inventory without affecting points.
      await axios.post("http://localhost:5000/reset-inventory");
      // Navigate to the next level.
      navigate("/games/game2")
    } catch (error) {
      console.error("Error restarting timer/inventory", error);
    }
  };

  return (
    <div className="story2-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="story-box">
        <h1 className="story-title">The Mystery of Willowmere Manor</h1>
        <p className="story-content">
        Decades ago, Lady Eleanor Ashcroft died mysteriously at a masquerade ball in Willowmere Manor, with Sandeep, her confidant, as the prime suspect. Years later, Vivek, Anant, Mannat, and Nihal venture into the manor to uncover the truth. They find a bloodstained mask, a poisoned goblet, and a broken watch stopped at the time of Eleanor's death. A blackmail letter reveals Sandeep threatened to expose Eleanor's financial troubles. A hidden key unveils Sandeep's confession: he poisoned Eleanor's wine to seize her estate, staging it as an accident. The friends leave, revealing the weight of Sandeep's betrayal and solving the mystery.        </p>
      </div>
      <button className="start-game-btn2" onClick={handleNextLevel}>
        Proceed to Game Room
      </button>
    </div>
  );
};

export default Story2;
