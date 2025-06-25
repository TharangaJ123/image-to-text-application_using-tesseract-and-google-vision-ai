import React, { useState } from 'react';
import axios from 'axios';

const UploadInvoice = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const handleChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const res = await axios.post('http://localhost:5000/upload-invoice', formData);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>
      {data && (
        <div>
          <h3>Extracted Data:</h3>
          <ul>
            {data.products.map((item, idx) => (
              <li key={idx}>
                {item.name} - Qty: {item.quantity} - Price: {item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadInvoice;
