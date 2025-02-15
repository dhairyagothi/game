import React from "react";
import clubLogo from './../assets/cwc logo.jpg';
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-box bg-black bg-opacity-70 p-8 rounded-lg flex flex-col items-center justify-center">
        <h1 className="college-name">VIT Bhopal University</h1>
        <h2 className="club-name">CyberWarrior Club</h2>
        <img src={clubLogo} alt="Club Logo" className="club-logo" />
        <Link to="/rules">
          <button className="game-button">Proceed to Game Room</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;