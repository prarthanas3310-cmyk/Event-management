import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import RegistrationList from './components/registrationlist';
import AddRegistration from './components/addregistration';
import EditRegistration from './components/editregistration';
import AddEvent from './components/AddEvent';
import Login from './components/Login';
import { ThemeProvider } from './ThemeContext';
import './App.css';

// Protects all app pages — redirects to /login if not logged in
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* Public pages — no sidebar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected pages — with sidebar */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="app-layout">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/registrations" element={<RegistrationList />} />
                      <Route path="/add" element={<AddRegistration />} />
                      <Route path="/edit/:id" element={<EditRegistration />} />
                      <Route path="/add-event" element={<AddEvent />} />
                    </Routes>
                  </main>
                </div>
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;