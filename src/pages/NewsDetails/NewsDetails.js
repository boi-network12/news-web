import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import "./NewsDetails.css";
import { BiEdit, BiSend, BiTrash } from "react-icons/bi";

const NewsDetails = () => {
  const location = useLocation();
  const {state} = location;
  const { user } = useContext(AuthContext);
  const { likePost, dislikePost, deletePost, updatePost } = useContext(PostContext);
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
  const [showModal, setShowModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  

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

  const url = `/newsDetails?title=${title}&image=${image}&likes=${likes || 0}&content=${content}&postId=${postId}`;

  const handleShare = async () => {
    const shareMessage = `${window.location.origin}${encodeURIComponent(url)}`;
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEdit = () => {
    setShowModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await updatePost(postId, { title: editedTitle, content: editedContent });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating post:", error);
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
          {user && (user?.role === "admin" || user?._id === state?.author) && (
            <button onClick={handleDelete} className="delete-button">
              <BiTrash size={20} />
            </button>
          )}
          {user && user?._id === state?.author && (
            <button onClick={handleEdit}  className="share-button">
              <BiEdit size={20} />
            </button>
          )}
          <button onClick={handleShare} className="share-button">
            <BiSend size={20} />
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
      {showModal && (
        <div className="news-modal-overlay">
          <div className="news-modal-content">
            <button onClick={() => setShowModal(false)} className="news-modal-close">
              ✖
            </button>
            <h3>Edit Post</h3>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="news-modal-input"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="news-modal-textarea"
            ></textarea>
            <div className="news-modal-actions">
              <button onClick={handleSaveEdit} className="news-modal-save">
                Save
              </button>
              <button onClick={() => setShowModal(false)} className="news-modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsDetails;
