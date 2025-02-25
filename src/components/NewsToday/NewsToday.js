import React from "react";
import { useNavigate } from "react-router-dom";
import "./NewsToday.css";
import { ClipLoader } from "react-spinners";

const NewsToday = ({ posts, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <p className="loading">
        <ClipLoader size={30} color="#333" />
      </p>
    );
  }

  const sortedPosts = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="news-container">
      {sortedPosts.map((item, index) => (
        <div
          key={index}
          className="news-item"
          onClick={() =>
            navigate("/newsDetails", {
              state: {
                title: item.title,
                image: item.image,
                likes: item.likeCount,
                content: item.content,
                postId: item._id,
                author: item.author._id,
              },
            })
          }
        >
          <img src={item.image} alt={item.title} className="news-image" />
          <div className="news-title">{item.title}</div>
        </div>
      ))}
    </div>
  );
};

export default NewsToday;
