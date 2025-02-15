import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './story1.css';

const Story1 = () => {
    const navigate = useNavigate();

    const startGame = async () => {
        try {
            // Call the backend to start/reset the game.
            const response = await axios.post("http://localhost:5000/start-game");
            console.log(response.data); // Optional: view returned timeLeft and points
            // Navigate to the Game1 route after successful start.
            navigate("/games/Game1");
        } catch (error) {
            console.error("Error starting game", error);
        }
    };

    return (
        <div className="story1-container">
            <div className="story-box">
                <h2>The Grimwood Mystery</h2>
                <p>
                    The Grimwood Estate in Ravenshade, a crumbling relic of the past, held a
                    sinister reputation. Decades ago, its reclusive owner, Lord Albert Grimwood,
                    was found dead in the parlor under suspicious circumstances...
                </p>
                <p>
                    Whispers pointed to his nephew, Nihal, who had visited that fateful evening
                    with business documents. However, Nihal denied wrongdoing, claiming his visit
                    was routine. As suspicion grew, Nihal mysteriously disappeared before the
                    investigation could conclude...
                </p>
                <p>
                    Townsfolk whispered of a Grimwood curse, and the mansion was abandoned to
                    decay, feared and avoided. Years later, friends Atharv, Mannat, Ayan, and
                    Mansi, intrigued by tales of the cursed estate, decided to uncover its secrets...
                </p>
                <p>
                    (Continue scrolling for the full story...)
                </p>
            </div>
            <button className="start-button" onClick={startGame}>
                Start the Game
            </button>
        </div>
    );
};

export default Story1;
