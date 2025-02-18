import React from "react";
import "./story3.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "./../../assets/story2themebg.png";

const Story3 = () => {
  const navigate = useNavigate();

  const handleNextLevel = async () => {
    try {
      // Call the endpoint to reset the timer (without changing points)
      await axios.post("http://localhost:5000/restart-timer");
      // Now reset the inventory without affecting points.
      await axios.post("http://localhost:5000/reset-inventory");
      // Navigate to the next level.
      navigate("/games/game3")
    } catch (error) {
      console.error("Error restarting timer/inventory", error);
    }
  };
  return (
    <div className="story2-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="story-box">
        <h1 className="story-title">The Villa of Whispers</h1>
        <p className="story-content">
        Atharva, Ambika, Ujjwal, and Mannat explore the Blackwood Villa, where Elias Blackwood was murdered, and his manager, Shivansh, was initially suspected. They find a shattered display case, a mirror with hidden messages, and property papers transferring Elias's fortune to his business partner, Nihal Awasthi. Elias's diary reveals his fear of Nihal's greed. In the cellar, they discover a pistol. They piece together the truth that Nihal forged the property papers and murdered Elias. Then he framed Shivansh. He killed Shivansh before he could reveal the truth. The motive was greed and betrayal, the emerald necklace distraction.        </p>
      </div>
      <button className="start-game-btn2" onClick={handleNextLevel}>
        Proceed to Game Room
      </button>
    </div>
  );
};

export default Story3;
