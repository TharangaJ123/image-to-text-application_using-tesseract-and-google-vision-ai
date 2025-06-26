import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../src/App.css'

const ImageProcessor = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const socketRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    socketRef.current.on('progress', (data) => {
      setProgress(data.message);
      if (data.status === 'completed' || data.status === 'error') {
        setIsProcessing(false);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
      setResult(null);
      setError(null);
      setProgress(null);
    }
  });

  const processImage = async () => {
    if (!file || !socketRef.current) return;
    
    setIsProcessing(true);
    setError(null);
    setProgress('Preparing to upload...');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/process-image`, 
        formData, 
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'x-socket-id': socketRef.current.id
          }
        }
      );
      
      setResult(response.data);
      console.log(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1>Image to Text Processor</h1>
      
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
        {file && <p>Selected: {file.name} ({Math.round(file.size / 1024)} KB)</p>}
      </div>
      
      {file && (
        <div className="processing-controls">
          <button 
            onClick={processImage} 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Image'}
          </button>
          {progress && <div className="progress-message">{progress}</div>}
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="results">
          <div className="result-section">
            <h2>Original Text</h2>
            <div className="text-content">{result.originalText}</div>
          </div>
          
          <div className="result-section">
            <h2>Processed Data</h2>
            <pre>{JSON.stringify(result.processedData.items, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;