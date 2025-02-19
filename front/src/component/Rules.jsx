import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Rules.css";

const Rules = () => {
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();

    // Load team name from localStorage on component mount
    useEffect(() => {
        const storedTeamName = localStorage.getItem("teamName");
        if (storedTeamName) {
            setTeamName(storedTeamName);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teamName.trim() === "") {
            alert("Please enter a team name.");
            return;
        }
        localStorage.setItem("teamName", teamName);
        navigate("/story1intro"); // Redirect to the game intro
    };

    return (
        <div className="game-container">
            <div className="rules-box w-max">
                <h1 className="rules-title text-5xl">Rules</h1>
                <p className="rules-content text-left text-xl">
                    1. Solve the mystery by gathering clues hidden in different areas.<br />
                    2. You have limited time, so think fast and act wisely.<br />
                    3. Work alone or with a team to deduce the murderer.<br />
                    4. Every choice matters; make sure to choose carefully.<br />
                    5. Once you're sure, submit your answer to see if you got it right!
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
                <input
                    type="text"
                    placeholder="Enter your Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="p-2 mb-4 rounded w-64"
                    required
                />
                <button type="submit" className="start-game-btn">
                    Start the Game
                </button>
            </form>
        </div>
    );
};

export default Rules;
