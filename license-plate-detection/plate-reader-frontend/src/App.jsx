import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentPlate, setCurrentPlate] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    // Poll for new plate numbers every second
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8204/current_plate');
        const data = await response.json();
        if (data.plate) {
          setCurrentPlate(data.plate);
          if (data.snapshot) {
            // Extract filename from the full path
            const filename = data.snapshot.split('/').pop();
            setSnapshot(`http://localhost:8204/snapshot/${filename}`);
          }
        }
      } catch (error) {
        console.error('Error fetching plate:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>License Plate Detection</h1>
      <div className="content">
        <div className="video-section">
          <h2>Live Feed</h2>
          <div className="video-container">
            <img src="http://localhost:8204/video_feed" alt="Video feed" />
          </div>
        </div>
        <div className="detection-section">
          <h2>Latest Detection</h2>
          <div className="plate-display">
            <div className="plate-number">
              {currentPlate || 'No plate detected'}
            </div>
          </div>
          {snapshot && (
            <div className="snapshot-container">
              <h3>Vehicle Snapshot</h3>
              <img src={snapshot} alt="Vehicle snapshot" className="snapshot" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;