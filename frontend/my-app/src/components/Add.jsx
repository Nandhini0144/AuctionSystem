import React, { useState ,useContext} from 'react';
import axios from 'axios';
import './Add.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {DomainContext } from '../App';


const Add = () => {
  const { authenticated } = useAuth(); // Use useAuth hook to access authentication state

  const [productName, setProductName] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('minutes');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const url=useContext(DomainContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('startingBid', startingBid);
      formData.append('duration', getDurationInSeconds());
      formData.append('description', description);
      formData.append('image', image);

      const response = await axios.post(`${url}/api/product/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      setSuccess(true);
      console.log(response.data.product._id);
      setTimeout(() => {
        const id = response.data.product._id;
        axios.post(`${url}/api/auction/startAuction/${id}`)
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getDurationInSeconds = () => {
    if (durationUnit === 'minutes') {
      return durationValue * 60; // Convert minutes to seconds
    } else if (durationUnit === 'hours') {
      return durationValue * 3600; // Convert hours to seconds
    } else {
      return durationValue * 86400; // Convert days to seconds
    }
  };

  return (
    <div className="container">
      {authenticated ? (
        <form className="form-container" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2 className="form-header">Add Product</h2>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Product added successfully!</div>}
          <div className="form-group">
            <label htmlFor="productName" className="form-label">Product Name:</label>
            <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="startingBid" className="form-label">Starting Bid:</label>
            <input type="number" id="startingBid" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Auction Duration:</label>
            <div className="duration-input">
              <input type="number" value={durationValue} onChange={(e) => setDurationValue(e.target.value)} className="form-input" required />
              <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)} className="form-select">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" required />
          </div>
          <div className="form-group">
            <label htmlFor="image" className="form-label">Image:</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="form-file" required />
          </div>
          <button type="submit" className="form-btn" disabled={loading}>Add Product</button>
        </form>
      ) : (
        <div className="login-message">
          <p>Please login to add product</p>
          <button className="profile-button" onClick={() => navigate('/login')}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Add;

