import React, { useState, useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../App';
import {DomainContext } from '../App';

const MyProCard = ({ product }) => {
  const [timer, setTimer] = useState(product.timer);
  const socket = useContext(SocketContext);
  const url=useContext(DomainContext);
  
  useEffect(() => {
    socket.on(`timerUpdate${product._id}`, handleTimerUpdate);
    return () => {
      socket.off(`timerUpdate${product._id}`, handleTimerUpdate);
    };
  }, [product._id]);

  // useEffect(() => {
  //   // Check if the auction has already started
  //   if (product.auctionStarted) {
  //     // If auction has started, disable the delete button
  //     alert("Auction has already started. You cannot delete the product.");
  //   }
  // }, [product.auctionStarted]);

  const handleTimerUpdate = ({ timer }) => {
    setTimer(timer);
  };

  const handleDelete = async () => {
    try {
      // Check if the auction has already started
      if (product.auctionStarted) {
        // If auction has started, don't allow deletion
        alert("Auction has already started. You cannot delete the product.");
        return;
      }

      const response = await axios.delete(`${url}/api/product/${product._id}`)

      if (!response.data) {
        throw new Error('Failed to delete product');
      }

    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error state
    }
  };

  return (
    <div className="product-container">
      <Link className="product-card" to={"/product/" + product._id}>
        <div>
          <img src={product.image} alt="Product" style={{ width: '100px', height: '100px' }} />
          <div>Name: {product.productName}</div>
          <div>Description: {product.description}</div>
          <div>Starting Bid: {product.startingBid}</div>
          <div>Timer: {timer}</div>
        </div>
      </Link>
      {!product.auctionStarted && <button onClick={handleDelete}>Delete</button>}

    </div>
  );
}

export default MyProCard;
