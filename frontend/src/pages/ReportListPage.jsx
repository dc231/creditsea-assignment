import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FileUpload from '../components/FileUpload';

const ReportListPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/api/reports');
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>CreditSea Report Dashboard</h1>
      </header>
      <FileUpload onUploadSuccess={fetchReports} />
      <div className="report-list">
        <h2>Available Reports</h2>
        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length > 0 ? (
          <ul>
            {reports.map((report) => (
              <li key={report.pan}>
                <Link to={`/report/${report.pan}`}>
                  <span className="name">{report.name}</span>
                  <span className="pan">PAN: {report.pan}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports found. Upload an XML file to get started.</p>
        )}
      </div>
    </div>
  );
};

export default ReportListPage;