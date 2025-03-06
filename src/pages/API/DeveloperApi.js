import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"
import { BiLogoTwitter, BiLogoGithub, BiLogoLinkedin, BiLogoInstagram } from "react-icons/bi";
import "./DeveloperApi.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_DOCUMENTATION } from "../../constant/Dev_Doc";
import { API_URL } from "../../config/config";

const DeveloperApi = () => {
  const [newsData, setNewsData] = useState([]);
  const apiUrl = `${API_URL}/api/news`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiUrl);
    toast.success("API URL copied to clipboard!y");
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [apiUrl]);

  const truncateContent = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return (
    <div className="DeveloperApiWrapper">
      <h1>🌍 Open Source News API</h1>
      <p>Access breaking news and articles worldwide via our JSON API.</p>
      <button onClick={copyToClipboard}>📋 Copy API URL</button>
      <p><strong>Example Response:</strong></p>
      <div className="news-box">
        {newsData.length > 0 ? (
          <pre>{JSON.stringify(newsData.map(news => ({ ...news, content: truncateContent(news.content, 50) })), null, 2)}</pre>
        ) : (
          <p>Loading example response...</p>
        )}
      </div>
      {/* API Documentation */}
      <div className="api-documentation" style={{
        width: "100%", 
        marginTop: 40
      }}>
        <h2>📜 API Documentation</h2>
        <ReactMarkdown>{API_DOCUMENTATION}</ReactMarkdown>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="social-icons">
          <a href="https://x.com/Echowire_News" target="_blank" rel="noopener noreferrer">
            <BiLogoTwitter className="icon" />
          </a>
          <a href="https://github.com/boi-network12/news_app_backend" target="_blank" rel="noopener noreferrer">
            <BiLogoGithub className="icon" />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <BiLogoLinkedin className="icon" />
          </a>
          <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <BiLogoInstagram className="icon" />
          </a>
        </div>
        <p className="footer-text">© 2022 - {new Date().getFullYear()} Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DeveloperApi;