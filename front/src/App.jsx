import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Rules from './component/Rules';
import './index.css';
import Game1 from './stories/story1/Game1';
import MysteryGame from './stories/story1/Game11';
import Room3 from './stories/story1/Game12';
import Game2 from './stories/story2/Game2';
import Game3 from './stories/story3/Game3';
import Story4 from './stories/story4/Game4';
import Leaderboard from './component/Leaderboard';
import Story1intro from './stories/story1/Story1intro';
import Story2intro from './stories/story2/Story2intro';
import Story3intro from './stories/story3/Story3intro';
import Story4intro from './stories/story4/Story4intro';
import FinalScore from './component/finalscore';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/story1intro" element={<Story1intro />} />
          <Route path="/games/Game1" element={<Game1 />} /> 
          <Route path="/games/Game11" element={<MysteryGame />} /> 
          <Route path="/games/Game12" element={<Room3 />} /> 
          <Route path="/story2intro" element={<Story2intro />} />
          <Route path="/games/Game2" element={<Game2 />} />
          <Route path="/story3intro" element={<Story3intro />} />
          <Route path="/games/Game3" element={<Game3 />} />
          <Route path="/story4intro" element={<Story4intro />} />
          <Route path="/games/Game4" element={<Story4 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/points" element={<FinalScore />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
