import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShare, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./NewsDetails.css";

const NewsDetails = () => {
  const location = useLocation();
  const {state} = location;
  const { user } = useContext(AuthContext);
  const { likePost, dislikePost, deletePost } = useContext(PostContext);
  const navigate = useNavigate();

  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
const title = state?.title || queryParams.get("title") || "No Title";
const image = state?.image || queryParams.get("image");
const likes = state?.likes || Number(queryParams.get("likes")) || 0;
const content = state?.content || queryParams.get("content") || "No content available.";
const postId = state?.postId || queryParams.get("postId");

  // Now use `likes` safely after it is defined
  const [liked, setLiked] = useState(likes > 0)
  
  

  const handleLike = async () => {
    if (!user?._id) return; // Ensure user is logged in
  
    try {
      await likePost(postId, user?._id);
      setLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const handleDislike = async () => {
    if (!user?._id) return;
  
    try {
      await dislikePost(postId, user?._id);
      setLiked(false);
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };
  

  const handleDelete = async () => {
    await deletePost(postId);
    navigate("/");
  };

  const handleShare = async () => {
    const shareMessage = `${title}\n\n${content}\n\nRead more: ${window.location.origin}/newsDetails/${postId}`;
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="news-details">
      {/* Header */}
      <div className="news-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft size={20} /> Back
        </button>
        <div className="action-buttons">
          {user?.role === "admin" && (
            <button onClick={handleDelete} className="delete-button">
              <FaTrash size={20} />
            </button>
          )}
          <button onClick={handleShare} className="share-button">
            <FaShare size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {image ? (
        <img src={image} alt={title} className="news-image" />
      ) : (
        <p className="no-image">Image not available</p>
      )}

      <h2 className="news-title">{title}</h2>
      <p className="likes-count">{likes} likes</p>

      {/* Like Button */}
      <button className="like-button" onClick={liked ? handleDislike : handleLike}>
        {liked ? <FaHeart className="liked" /> : <FaRegHeart className="not-liked" />}
        {liked ? "Unlike" : "Like"}
      </button>

      {/* Content */}
      <p className="news-content">{content}</p>
    </div>
  );
};

export default NewsDetails;
