import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SignupPage from './pages/RegisterPage';
import { Layout } from '../components/layout';
import { FlightSelectionPage } from './pages/FlightSelectionPage';
import { ReturnFlightPage } from './pages/ReturnFlightPage';
import { FlightReviewPage } from './pages/ReviewFlightPage';
import { AuthProvider } from './context/AuthContext';
import { FlightSelectionProvider } from './context/FlightSelectionContext';
import React from 'react';

function App() {
  return (
    <FlightSelectionProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/flight-selection" element={<FlightSelectionPage />} />
              <Route path="/return-flight" element={<ReturnFlightPage />} />
              <Route path="/review-flight" element={<FlightReviewPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/books" element={<MyBookingsPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </FlightSelectionProvider>
  );
}

export default App;
