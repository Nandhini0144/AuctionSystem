import React, { useState, useEffect,useContext } from 'react';
import ProCard from './ProCard';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');
import { SocketContext } from '../App';
import {DomainContext } from '../App';


const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [List,setList]=useState([])
  const socket = useContext(SocketContext);
  const url=useContext(DomainContext);
 

  useEffect(() => {
    fetchData();
    // Listen for 'addProduct' event
    socket.on('addProduct', handleAddProduct);
    // Cleanup function to remove event listener
    return () => {
      socket.off('addProduct', handleAddProduct);
    };
  });

  const fetchData = async () => {
    try {
      const result = await fetch(`${url}/api/product/allProducts`);
      if (!result.ok) {
        throw new Error('Failed to fetch products');
      }
      const json = await result.json();
      setProducts(json);
      setList(json);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const handleAddProduct = ({ product }) => {
    setProducts(prevProducts => [...prevProducts, product]);
  }

  const updateSearchText = (e) => {
    const val = e.target.value;
    setSearchText(val);
    filterBySearchProduct(val);
  }

  const filterBySearchProduct = (val) => {
    const filteredData = products.filter((p) => {
      return p.productName.toLowerCase().includes(val.toLowerCase());
    })
    setList(filteredData);
  }

  if (products.length === 0) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <input value={searchText} onChange={updateSearchText} placeholder="Search products..." />
      <div className='product-container'>
        {List.map((pro) => (
          <ProCard key={pro._id} product={pro} />
        ))}
      </div>
    </>
  );
}

export default ProductContainer;
