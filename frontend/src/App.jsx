import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportListPage from './pages/ReportListPage';
import ReportDetailPage from './pages/ReportDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportListPage />} />
        <Route path="/report/:pan" element={<ReportDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;