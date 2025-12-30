import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CinematographyPage from './pages/CinematographyPage';
import PhotographyPage from './pages/PhotographyPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const showNavigation = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cinematography" element={<CinematographyPage />} />
        <Route path="/photography" element={<PhotographyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery/:category" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
