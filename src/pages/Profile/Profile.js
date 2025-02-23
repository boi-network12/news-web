import React, { useContext } from 'react';
import { FaUserCircle, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaKey } from 'react-icons/fa';
import './Profile.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <h2>Profile</h2>
      </div>
      
      {/* Profile Picture and Name */}
      <div className="profile-section">
        <FaUserCircle className="profile-icon" />
        <h3>{user?.name || "Guest"}</h3>
      </div>
      
      {/* User Information */}
      <div className="profile-info">
        <ProfileItem icon={<FaEnvelope />} label="Email" value={user?.email || "N/A"} />
        <ProfileItem icon={<FaGlobe />} label="Country" value={user?.country || "N/A"} />
        <ProfileItem icon={<FaMapMarkerAlt />} label="IP Address" value={user?.ipAddress || "N/A"} />
        <ProfileItem icon={<FaKey />} label="Password" value="********" />
      </div>
      
      {/* App Version */}
      <p className="app-version">App Version: 1.0.0</p>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  return (
    <div className="profile-item">
      {icon}
      <span className="profile-label">{label}:</span>
      <span className="profile-value">{value}</span>
    </div>
  );
};

export default Profile;
