import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('reportFile', file);
    setLoading(true);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data.message);
      onUploadSuccess(); // Notify parent component to refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during upload.');
      setMessage('');
    } finally {
      setLoading(false);
      setFile(null);
      e.target.reset(); // Reset the file input form
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Credit Report</h2>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".xml" onChange={onFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default FileUpload;