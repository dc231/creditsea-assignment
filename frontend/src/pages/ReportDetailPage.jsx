import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ReportDetailPage = () => {
  const { pan } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/reports/${pan}`;
        const { data } = await axios.get(apiUrl);
        setReport(data);
      } catch (err) {
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [pan]);

  if (loading) return <p className="container">Loading report...</p>;
  if (error) return <p className="container message error">{error}</p>;
  if (!report) return <p className="container">Report not found.</p>;

  return (
    <div className="container">
      <Link to="/" className="back-link"> &larr; Back to Dashboard</Link>
      <h1>Credit Report for {report.name}</h1>

      <div className="report-section">
        <h2>Basic Details</h2>
        <div className="grid">
          <div><strong>Name:</strong> {report.name}</div>
          <div><strong>PAN:</strong> {report.pan}</div>
          <div><strong>Mobile:</strong> {report.mobile || 'N/A'}</div>
          <div><strong>Credit Score:</strong> <span className="score">{report.creditScore}</span></div>
        </div>
      </div>

      <div className="report-section">
        <h2>Report Summary</h2>
        <div className="grid">
          <div><strong>Total Accounts:</strong> {report.totalAccounts}</div>
          <div><strong>Active Accounts:</strong> {report.activeAccounts}</div>
          <div><strong>Closed Accounts:</strong> {report.closedAccounts}</div>
          <div><strong>Total Balance:</strong> ₹{report.totalCurrentBalance?.toLocaleString('en-IN')}</div>
          <div><strong>Secured Balance:</strong> ₹{report.totalSecuredBalance?.toLocaleString('en-IN')}</div>
          <div><strong>Unsecured Balance:</strong> ₹{report.totalUnsecuredBalance?.toLocaleString('en-IN')}</div>
          <div><strong>Enquiries (Last 7 Days):</strong> {report.enquiriesLast7Days}</div>
        </div>
      </div>

      <div className="report-section">
        <h2>Credit Accounts Information</h2>
        <table>
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>Current Balance</th>
              <th>Amount Overdue</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {report.accounts.map((acc, index) => (
              <tr key={index}>
                <td>
                  {acc.subscriberName}
                  {acc.isCreditCard && <span className="badge">Credit Card</span>}
                </td>
                <td>{acc.accountNumber}</td>
                <td>₹{acc.currentBalance?.toLocaleString('en-IN')}</td>
                <td>₹{acc.amountOverdue?.toLocaleString('en-IN')}</td>
                <td>{acc.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportDetailPage;