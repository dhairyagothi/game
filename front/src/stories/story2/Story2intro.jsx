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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora quasi eveniet temporibus dicta laborum quisquam fugiat sapiente voluptatum, pariatur dolor doloribus eos nulla. Molestias inventore itaque reprehenderit debitis omnis dolorum cum recusandae odio velit rerum mollitia laboriosam tempora, a nobis ratione quod. Odit voluptate deleniti, deserunt magni quod alias eos!
        </p>
      </div>
      <button className="start-game-btn2" onClick={handleNextLevel}>
        Proceed to Game Room
      </button>
    </div>
  );
};

export default Story2;
