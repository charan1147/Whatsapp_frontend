import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import VideoCall from "./components/VideoCall";
import Navbar from "./components/Navbar";

const App = () => {
  const { user, loading, isLoggedOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    const protectedRoutes = ["/chat", "/video-call"];
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith("/video-call/")
    );

    if (!user && isProtectedRoute) {
      navigate("/");
    }

    const publicRoutes = ["/", "/login", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    if (isLoggedOut && !isPublicRoute) {
      navigate("/");
    }
  }, [user, loading, isLoggedOut, location, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/video-call/:contactId" element={<VideoCall />} />
      </Routes>
    </>
  );
};

export default App;