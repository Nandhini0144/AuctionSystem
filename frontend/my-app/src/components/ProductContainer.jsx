import React, { useState, useEffect, useContext } from 'react';
import ProCard from './ProCard';
import { SocketContext, DomainContext } from '../App';

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const socket = useContext(SocketContext);
  const url = useContext(DomainContext);

  useEffect(() => {
    fetchData();
    // Listen for 'addProduct' event
    socket.on('addProduct', handleAddProduct);
    // Cleanup function to remove event listener
    return () => {
      socket.off('addProduct', handleAddProduct);
    };
  }, []);

  useEffect(() => {
    filterBySearchProduct(searchText);
  }, [searchText, products]);

  const fetchData = async () => {
    try {
      const result = await fetch(`${url}/api/product/allProducts`);
      if (!result.ok) {
        throw new Error('Failed to fetch products');
      }
      const json = await result.json();
      setProducts(json);
      setFilteredProducts(json);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const updateSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const filterBySearchProduct = (val) => {
    const filteredData = products.filter((p) => 
      p.productName.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredProducts(filteredData);
  };

  if (products.length === 0) {
    return <div>Loading....</div>;
  }

  return (
    <div className='app-container'>
      <input
        className='search-bar'
        value={searchText}
        onChange={updateSearchText}
        placeholder="Search products..."
      />
      <div className='product-container'>
        {filteredProducts.map((pro) => (
          <ProCard key={pro._id} product={pro} />
        ))}
      </div>
    </div>
  );
};

export default ProductContainer;
