import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import LandingPage from './components/LandingPage';
import RegistrationList from './components/registrationlist';
import AddRegistration from './components/addregistration';
import EditRegistration from './components/editregistration';
import AddEvent from "./components/AddEvent";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing page — full width, no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages — with sidebar */}
        <Route path="/*" element={
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
        } />

      </Routes>
    </Router>
  );
}

export default App;