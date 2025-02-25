import React from "react";
import "./BBCNewsLive.css";

const BBCNewsLive = () => {
  return (
    <div className="bbc-news-container">
      <h2>Live BBC News</h2>
      <div className="bbc-news-iframe">
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/m3q7ZQhUow8?autoplay=1&mute=1"
          title="BBC News Live"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default BBCNewsLive;
