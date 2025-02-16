import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './story4.css';

const Story4 = () => {
    const navigate = useNavigate();

    const startGame = async () => {
        try {
            // Call the backend to start/reset the game.
            const response = await axios.post("http://localhost:5000/start-game");
            console.log(response.data); // Optional: view returned timeLeft and points
            // Navigate to the Game4 route after successful start.
            navigate("/games/Game4");
        } catch (error) {
            console.error("Error starting game", error);
        }
    };

    return (
        <div className="story1-container">
            <div className="story-box">
                <h2>A Haunting Halloween Murder Mystery at Hollow Manor</h2>
                <p>
                    On a chilling Halloween night, Lord Shivansh hosts an elaborate masquerade
                    ball at his infamous Victorian mansion. The guest list is a carefully curated mix
                    of aristocrats, artists, and mysterious strangers, each wearing intricate masks
                    that hide their true intentions.
                </p>
                <p>
                    The evening begins with an air of tension and anticipation. Detective Ayan, 
                    disguised among the guests, has been secretly investigating Lord Shivansh's past. 
                    Lady Supriya, an artist known for her eerie landscape paintings, watches the guests 
                    with an unsettling gaze. The loyal butler Sandeep and the observant young maid 
                    Mansi move silently through the crowded rooms.
                </p>
                <p>
                    As the clock strikes midnight, a blood-curdling scream echoes through the manor. 
                    A prominent guest is found dead in the library - stabbed with an antique letter opener 
                    that belongs to Lord Shivansh himself. The murder weapon is positioned deliberately, 
                    almost like a staged theatrical performance.
                </p>
                <p>
                    Detective Ayan's investigation of Hollow Manor transcended a typical murder
                    inquiry, evolving into a complex exploration of family secrets. Each clue and 
                    testimony peeled back another layer of deception, transforming the case from a 
                    straightforward crime to a profound psychological study of human nature, betrayal, 
                    and the extreme lengths individuals might go to protect long-held family secrets.
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

export default Story4;
