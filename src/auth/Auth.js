import React, { useState, useContext } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    
    if (isLogin) {
      await login({ email, password });
    } else {
      await register(name, email, password);
    }
    
    setLoading(false);
    navigate(-1); // Navigate back after success
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="left-panel">
          <h1 className="logo">📰 NewsWave</h1>
          <p className="tagline">Stay updated with the latest news</p>
        </div>
        <div className="right-panel">
          <div className="tabs">
            <span className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>LOGIN</span>
            <span className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>REGISTER</span>
          </div>
          <form onSubmit={handleSubmit} className="form">
            {!isLogin && <input type="text" name="name" placeholder="Full Name" required />}
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}>
                  <ClipLoader size={20} color="#fff" />
                  <p>{isLogin ? "Loading..." : "Registering..."}</p>
                </div>
              ) : isLogin ? "Login" : "Register"}
            </button>
          </form>
          {isLogin && <p className="forgot-password">Forgot password?</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
