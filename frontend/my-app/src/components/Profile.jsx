import React, { useState, useEffect,useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext
import './Profile.css'; // Import CSS file
import {DomainContext } from '../App';

const Profile = () => {
  const { authenticated } = useAuth(); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const url=useContext(DomainContext);
  
  useEffect(() => {
    if (authenticated) {
      fetchProfileDetails();
    }
  }, [authenticated]);

  const fetchProfileDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/user/profileDetails`);
      setName(response.data.name);
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleModifyProfile = async () => {
    try {
      const response = await axios.put(`${url}/api/user/profile`, {
        name: name,
        password: password
      });
      if (response.status === 200) {
        console.log('Profile modified successfully');
        alert('Profile modified successfully');
      }
    } catch (error) {
      console.error('Error modifying profile:', error);
    }
  };

  const navigateToMyProducts = () => {
    if (authenticated) {
      navigate('/myProducts');
    } else {
      alert("You are not authenticated");
    }
  };

  const navigateToPurchasedProducts = () => {
    if (authenticated) {
      navigate('/purchasedProducts');
    } else {
      alert("You are not authenticated");
    }
  };

  return (
    <div className="profile-container">
      {authenticated ? (
        <>
          <div className="profile-heading">Profile</div>
          <form className="profile-form">
            <div className="profile-input">
              <label className="profile-label">Name:</label>
              <input type="text" value={name} onChange={handleNameChange} />
            </div>
            <div className="profile-input">
              <label className="profile-label">Change Password:</label>
              <input type="password" onChange={handlePasswordChange} />
            </div>
            <button className="profile-button" type="button" onClick={handleModifyProfile}>Modify Profile</button>
          </form>
          <button className="profile-button" onClick={navigateToMyProducts}>My Products</button>
          <button className="profile-button" onClick={navigateToPurchasedProducts}>Purchased Products</button>
        </>
      ) : (
        <div className="profile-authenticate">
          <p>Please login to view your profile</p>
          <button className="profile-button" onClick={() => navigate('/login')}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Profile;



