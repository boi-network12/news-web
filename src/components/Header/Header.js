import React, { useState, useEffect, useContext } from 'react';
import "./Header.css";
import { Link } from 'react-router-dom';
import { BiBell, BiEdit, BiUser } from "react-icons/bi";
import { AuthContext } from '../../context/AuthContext';

export const Header = ({unreadCount}) => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`HeaderWrapper ${showHeader ? "show" : "hide"}`}>
      <Link to="/">
        <img src={require("../../assets/logo512.png")} alt="Logo" />
      </Link>

      <div className="iconDisplayBtn">
        <Link to={user ? "/notification" : "/auth"} className="notification-icon">
           {unreadCount > 0 && <p className="notification-badge">{unreadCount}</p>}
           <BiBell color='#333' size={25} />
        </Link>

        <Link>
          <BiEdit color='#333' size={25} />
        </Link>
        <Link to={user ? "/profile" : "/auth"} >
          {user ? <BiUser color='#333' size={25} /> : "Register"}
        </Link>
      </div>
    </div>
  );
};
