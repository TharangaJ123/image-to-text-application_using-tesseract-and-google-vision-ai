import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => setFile(e.target.files[0]);

  // Step 1: Correct OCR text using Hugging Face BART
  const correctWithAI = async (text) => {
    const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    const API_TOKEN = "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"; // Replace with your token

    try {
      const response = await axios.post(
        API_URL,
        { inputs: `Correct this invoice text: "${text}"` },
        { 
          headers: { 
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json" 
          } 
        }
      );
      return response.data[0]?.generated_text || text;
    } catch (error) {
      console.error("AI correction failed:", error);
      return text; // Fallback to original text
    }
  };

  // Step 2: Extract and correct invoice data
  const processInvoice = async () => {
    if (!file) return;
    setIsLoading(true);

    // Perform OCR
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    setOcrText(text);

    // Correct OCR errors with AI
    const corrected = await correctWithAI(text);
    setCorrectedText(corrected);

    // Extract structured data (updated to handle corrected text)
    const items = extractFields(corrected);

    // Save to backend
    await axios.post('http://localhost:5000/save-text', {
      rawText: text,
      correctedText: corrected,
      items,
    });

    setIsLoading(false);
  };

  // Step 3: Extract fields from corrected text
  const extractFields = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const items = [];
    let inTable = false;

    for (const line of lines) {
      // Detect table start (flexible for OCR errors)
      if (line.match(/QTY|DESCRIPTION|UNIT PRICE|AMOUNT/i)) {
        inTable = true;
        continue;
      }

      // Stop at summary sections
      if (line.match(/SUBTOTAL|TOTAL|TAX/i)) break;

      // Parse table rows (supports both clean and OCR-damaged formats)
      if (inTable) {
        const match = line.match(/^(\d+)\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/i) || 
                      line.match(/^(\d+)\s+(.+?)\s+(\d+)\s+(\d+)/i);

        if (match) {
          items.push({
            quantity: match[1],
            description: match[2].trim(),
            unitPrice: match[3].replace(',', ''),
            amount: match[4].replace(',', '')
          });
        }
      }
    }

    return items;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Invoice Processor</h1>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={processInvoice} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Process Invoice'}
      </button>

      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <div>
          <h3>Raw OCR Text</h3>
          <textarea value={ocrText} readOnly style={{ width: '400px', height: '300px' }} />
        </div>
        <div>
          <h3>AI-Corrected Text</h3>
          <textarea value={correctedText} readOnly style={{ width: '400px', height: '300px' }} />
        </div>
      </div>
    </div>
  );
}

export default App;