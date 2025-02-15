import React from 'react'
import './Rules.css'

const Rules = () => {
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
            <a href="/story1intro">
                <button className="start-game-btn">Start the Game</button>
            </a>
        </div>

    )
}

export default Rules
