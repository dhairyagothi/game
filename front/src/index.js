import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const AudioPlayer = () => (
  <audio autoPlay loop>
    <source src="/bg.mp3" type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AudioPlayer />
    <App/>
  </React.StrictMode>
);
