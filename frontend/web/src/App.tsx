import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import LoginPage from "./pages/loginPage";
import SearchPage from "./pages/searchPage";
import BookingPage from "./pages/bookingPage";
import NotificationsPage from "./pages/notificationsPage";
import AdminPage from "./pages/adminPage";
import MlPricePage from "./pages/mlPricePage";
import ProtectedRoute from "./auth/protectedRoute";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SearchPage />} />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="/ml" element={<MlPricePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
