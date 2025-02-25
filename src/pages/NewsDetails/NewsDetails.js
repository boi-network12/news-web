import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Updated icons
import "./NewsDetails.css";
import {  BiChevronLeft, BiEdit, BiSend, BiTrash } from "react-icons/bi";

const NewsDetails = () => {
  
  const location = useLocation();
  const { state } = location;
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
  const author = state?.author || queryParams.get("postId");

  //const ogImage = `https://news-web-wine.vercel.app/${image}` || `%PUBLIC_URL%/${image}`;

  const [liked, setLiked] = useState(likes > 0);
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
    const shareMessage = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(shareMessage);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePost(postId, { title: editedTitle, content: editedContent });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const renderContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
          <LinkPreview key={index} url={part}/>
        </a>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const LinkPreview = ({ url }) => {
    const [meta, setMeta] = useState(null);

    useEffect(() => {
      fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=c3c39fda-8b93-4459-9f5b-fcafda1ed3d9`)
      .then((res) => res.json())
      .then((data) => setMeta(data.openGraph))
      .catch((err) => console.error("Error fetching preview:", err));
    },[url])

    return meta ? (
      <div className="link-preview">
        <a href={url} target="_blank" rel="noopener noreferrer" className="link-preview-link">
          <img src={meta.image} alt={meta.title} className="link-preview-image" />
          <h4 className="link-preview-title">{meta.title}</h4>
          <p className="link-preview-description">{meta.description}</p>
        </a>
      </div>
    ) : (
      <a href={url} target="_blank" rel="noopener noreferrer" className="link-preview-fallback">
        {url}
      </a>
    );
  }

  return (
    <div className="news-details">
      {/* Header */}
      <div className="news-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <BiChevronLeft size={25} /> 
        </button>
        <div className="action-buttons">
          {user && (user?.role === "admin" || user?._id === state?.author) && (
            <button onClick={handleDelete} className="delete-button">
              <BiTrash size={20} />
            </button>
          )}
          {user && user?._id === author && (
            <button onClick={handleEdit} className="share-button">
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

      {/* Like/Dislike Buttons */}
      <div className="like-dislike-buttons">
        <button className="like-button" onClick={handleLike}>
          <FaThumbsUp className={liked ? "liked" : "not-liked"} />
          Like
        </button>
        <button className="like-button" onClick={handleDislike}>
          <FaThumbsDown className={liked ? "not-liked" : "liked"} />
          Unlike
        </button>
      </div>

      {/* Content */}
      <p className="news-content">{renderContent(content)}</p>

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