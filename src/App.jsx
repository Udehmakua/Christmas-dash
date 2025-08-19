import React, { useEffect, useState } from 'react';
import './App.css';

const startDate = new Date("2025-08-20");
const endDate = new Date("2025-08-31");

function App() {
  const [winnersData, setWinnersData] = useState({});
  const [videoData, setVideoData] = useState({});

  useEffect(() => {
    fetch('/raffle-winners.json')
      .then(res => res.json())
      .then(data => setWinnersData(data))
      .catch(err => console.error("Failed to fetch winners data:", err));

    fetch('/videos.json')
      .then(res => res.json())
      .then(data => setVideoData(data))
      .catch(err => console.error("Failed to fetch video data:", err));
  }, []);

  const toggleAccordion = (id) => {
    const content = document.getElementById(id);
    const isVisible = content.style.display === 'block';
    document.querySelectorAll('.accordion-content').forEach(el => el.style.display = 'none');
    content.style.display = isVisible ? 'none' : 'block';
  };

  const getDateLabel = (d) => d.toLocaleDateString("en-US", {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const accordionItems = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateId = d.toISOString().split('T')[0];
    const winners = winnersData[dateId] || [];
    const videoUrl = videoData[dateId]; // no fallback

    accordionItems.push(
      <div className="accordion-item" key={dateId}>
        <div className="accordion-header" onClick={() => toggleAccordion(dateId)}>
          {getDateLabel(d)}
        </div>
        <div className="accordion-content" id={dateId}>
          <h3>Campaign Winners</h3>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Cash Prize (₦)</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((w, i) => (
                <tr key={i}>
                  <td>{w.user_id}</td>
                  <td>{w.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
      <div className="video-section">
    </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <img src="Multipliers.png" alt="Danfo Lagos Multiplier" className="logo" />
      </header>
      <main id="raffleContainer">{accordionItems}</main>
    </div>
  );
}

export default App;
