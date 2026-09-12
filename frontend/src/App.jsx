import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import NotificationsPage from "./pages/NotificationsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import UserProfilePage from "./pages/UserProfilePage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/followers"
  element={<ConnectionsPage />}
/>

<Route
  path="/following"
  element={<ConnectionsPage />}
/>
<Route
  path="/profile/:userId"
  element={<UserProfilePage />}
/>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
  path="/home"
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  }
/>
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;