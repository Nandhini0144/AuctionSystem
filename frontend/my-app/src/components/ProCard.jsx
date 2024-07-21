import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("https://auctionsystem-2.onrender.com");

const ProCard = (props) => {
  const { product } = props;
  const [timer, setTimer] = useState(product.timer);

  useEffect(() => {
    socket.on(`timerUpdate${product._id}`, handleTimerUpdate);
    return () => {
      socket.off(`timerUpdate${product._id}`, handleTimerUpdate);
    };
  }, [product._id]);

  const handleTimerUpdate = ({ timer }) => {
    setTimer(timer);
  };

  return (
    <div className="product-container">
      <Link className="product-card" to={`/product/${product._id}`}>
        <div>
          <img src={product.image} alt="Product" />
          <div className="product-name">Name: {product.productName}</div>
          <div className="product-description">Description: {product.description}</div>
          <div>Starting Bid: ${product.startingBid}</div>
          <div className="product-timer">Timer: {timer}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProCard;
