import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { SocketContext } from '../App';
import { useAuth } from './AuthContext';
import './productDetails.css'
import {DomainContext } from '../App';

const ProductDetails = () => {
  const { productId } = useParams();
  const { userId } = useAuth();
  const socket = useContext(SocketContext);
  const [product, setProduct] = useState(null);
  const [timer, setTimer] = useState(0);
  const [bidders, setBidders] = useState([]);
  const [userBid, setUserBid] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [isSold, setIsSold] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [topBidders, setTopBidders] = useState([]);
  const url=useContext(DomainContext);
  const { authenticated } = useAuth();
  
  
  useEffect(() => {
    if(authenticated)
    {
    fetchProductDetails(productId);
    fetchTopBidders(productId);
    
    socket.on(`timerUpdate${productId}`, handleTimerUpdate);
    socket.on(`bidPosted${productId}`, handleBidUpdate);
    socket.on(`auctionEnded${productId}`, handleSoldUpdate);

    return () => {
      socket.off(`timerUpdate${productId}`, handleTimerUpdate);
      socket.off(`bidPosted${productId}`, handleBidUpdate);
      socket.off(`auctionEnded${productId}`, handleSoldUpdate);
    };
  }
  }, [productId,authenticated]);

  const handleTimerUpdate = ({ timer }) => {
    setTimer(timer);
  };

  const handleBidUpdate = ({ highestBid, biduserId }) => {
    setHighestBid(highestBid);
    if (biduserId === userId) setUserBid(highestBid);
    fetchTopBidders(productId);
  };

  const handleSoldUpdate = async ({ product }) => {
    setIsSold(product.sold);
    setWinner(product.winner);
    if (product.winner) {
      try {
        const winnerResponse = await axios.get(`${url}/api/user/winnerDetails/${product.winner}/${productId}`);
        setWinnerDetails(winnerResponse.data);
      } catch (error) {
        console.error('Error fetching winner details:', error);
            }
    }
  };

  const fetchTopBidders = async (productId) => {
    try {
      const response = await axios.get(
        `${url}/api/bid/topBids/${productId}`
      );
      setTopBidders(response.data);
    } catch (error) {
      console.error('Error fetching top bidders:', error);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`${url}/api/product/displayProduct/${productId}`);
      setProduct(response.data);
      setWinner(response.data.winner);
      setIsSold(response.data.sold);
      setTimer(response.data.timer);
      setHighestBid(response.data.currentBid);
      let userHighestBid = 0;
      for (const bid of response.data.bids) {
        if (bid.user == userId) {
          userHighestBid = Math.max(userHighestBid, bid.amount);
        }
      }
      setUserBid(userHighestBid);
      if (response.data.winner) {
        const winnerResponse = await axios.get(`${url}/api/user/winnerDetails/${response.data.winner}/${productId}`);
        setWinnerDetails(winnerResponse.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const placeBid = async () => {
    const amount = prompt('Enter your bid amount:');
    if (amount && Number.isInteger(Number(amount))) {
      try {
        const response = await axios.post(`${url}/api/bid/addBid/${productId}?amount=${amount}`);
        setProduct(response.data);
      } catch (error) {
        alert('Enter amount higher than the current highest bid!!');
        console.error('Error placing bid:', error);
      }
    } else {
      alert('Please enter valid amount');
    }
  };

  return (
    <div className="product-details-container">
      {authenticated && product && (
        <div>
          <img src={product.image} alt="Product" style={{ width: '100px', height: '100px' }} />
          <h2>{product.productName}</h2>
          <p>Description: {product.description}</p>
          <p>Starting Bid: {product.startingBid}</p>
          <p>Highest bid: {highestBid}</p>
          {(product.seller._id !== userId && product.auctionStarted) &&
            <p>Your Current Bid: {userBid}</p>}
          <p>Timer: {timer}</p>
          {(product.seller._id !== userId && !isSold && product.auctionStarted && !product.auctionEnded) &&
            <button onClick={placeBid}>Place Bid</button>}
          {(isSold && product.seller._id === userId) &&
            <p>Winner: {winner}</p>}
          {(isSold) &&
            <p>Product has sold! Auction ended</p>}
            {
              (!isSold) &&
              <p>Product has not sold ! Auction ended   </p>
            }
          {(product.seller._id === userId && isSold && winnerDetails) &&
            <div>
              <p>Winner Name: {winnerDetails.name}</p>
              <p>Winner Email: {winnerDetails.email}</p>
            </div>
          }
          {winner && (winner === userId) &&
            <div>
              <p>Congrats!! You won the bid</p>
              <p>Seller: {product.seller._id}</p>
              <p>Seller Name: {product.seller.name}</p>
              <p>Seller Email: {product.seller.email}</p>
            </div>}
        </div>
      )}
      {
      authenticated && product && !isSold && product.auctionStarted && !product.auctionEnded && !winner &&
      <div className="side-panel">
        <h3>Top 10 Bidders:</h3>
        <ul>
          {topBidders.map((bidder, index) => (
            <li key={index}>
              {bidder.user} - Rs.{bidder.amount}
            </li>
          ))}
        </ul>
      </div>
}   
{
  !authenticated &&
  <div className="profile-authenticate">
          <p>Please login to view product details</p>
          <button className="profile-button" onClick={() => navigate('/login')}>Login</button>
        </div>
}
    </div>
  );
};

export default ProductDetails;

