import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ title, image, likes, content, postId, author }) => {


  return (
    <Link 
        to="/newsDetails"
        state={{ title, image, likes, content, postId, author }}
        className="news-card"
        >
      <div className="news-card__image-container">
        <img src={image} alt={title} className="news-card__image" />
      </div>
      <div className="news-card__content">
        <h3 className="news-card__title">{title}</h3>
        <p className="news-card__description">{content.slice(0, 100)}...</p>
        <div className="news-card__footer">
          <span className="news-card__likes">❤️ {likes}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
