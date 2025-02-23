import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Auth from './auth/Auth';
import Notification from './pages/Notification/Notification';
import Profile from './pages/Profile/Profile';
import { ToastContainer } from "react-toastify";
import NewsDetails from './pages/NewsDetails/NewsDetails';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/newsDetails" element={<NewsDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

// http://localhost:3000/newsDetails?title=Uncle%20chukwuma&image=https%3A%2F%2Fres.cloudinary.com%2Fdypgxulgp%2Fimage%2Fupload%2Fv1740339015%2Fupload_1740339013478_cpsp5a.jpg&likes=0&content=Thanks%20for%20helping%20me%20&postId=67bb7748a726a4942f477494