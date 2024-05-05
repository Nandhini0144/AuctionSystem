import {Link} from 'react-router-dom'
import React, { useState, useEffect,useContext} from 'react';
import io from 'socket.io-client';

const socket = io("http://192.168.48.239:5000");
const ProCard=(props)=>{
const{product}=props;
const[timer,setTimer]=useState(product.timer);
useEffect(() =>{
    socket.on(`timerUpdate${product._id}`, handleTimerUpdate);
    return () => {
      socket.off(`timerUpdate${product._id}`, handleTimerUpdate);
    };
  }, [product._id]);

  const handleTimerUpdate = ({ timer }) => {
    setTimer(timer);
  };
return(
<div className="product-container">
<Link className="product-card" to={"/product/"+product._id}>
    <div>
    <img src={product.image} alt="Product" style={{ width: '100px', height: '100px' }} />
    <div>Name:{product.productName}</div>
    <div>Description:{product.description}</div>
    <div>StartingBid:{product.startingBid}</div>
    <div>Timer:{timer}</div>
    </div>
</Link>
</div>)
}
export default ProCard