import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Auth from './auth/Auth';
import Notification from './pages/Notification/Notification';
import Profile from './pages/Profile/Profile';
import { ToastContainer } from "react-toastify";
import NewsDetails from './pages/NewsDetails/NewsDetails';
import Post from './pages/Post/Post';
import PrivateRoute from './Private/PrivateRoutes';
import DeveloperApi from './pages/API/DeveloperApi';
import NotFound from './components/NotFound/NotFound';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/newsDetails" element={<NewsDetails />} />


        <Route path="/post" element={<PrivateRoute element={<Post />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/notification" element={<PrivateRoute element={<Notification />} />} />
        <Route path="/developer-api" element={<PrivateRoute element={<DeveloperApi />} />} />

        <Route path='*' element={<NotFound />} />

      </Routes>
        <ScrollToTop/>
    </Router>
  );
}

export default App;
