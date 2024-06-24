import React, { useState, useEffect,useContext } from 'react';
import MyProCard from './MyProCard';
import axios from 'axios';
import { SocketContext } from '../App';
import {useAuth} from './AuthContext'
import {DomainContext } from '../App';


const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [List,setList]=useState([])
  const socket = useContext(SocketContext);
  const { userId } = useAuth();
  const url=useContext(DomainContext);


  useEffect(() => {
    fetchData();
    // Listen for 'addProduct' event
    socket.on('addProduct', handleAddProduct);
    // Cleanup function to remove event listener
    return () => {
      socket.off('addProduct', handleAddProduct);
    };
  }, [products]);

  const fetchData = async () => {
    try {
      const result = await axios.get(`${url}/api/product/retriveByUserId`);
      if (!result) {
        throw new Error('Failed to fetch products');
      }
      const json=result.data;
      setProducts(json);
      setList(json);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  const handleAddProduct = ({ product }) => {
    if (product.seller === userId) {
    setProducts(prevProducts => [...prevProducts, product]);
  }
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

  return (
    <div className='myProduct-container'>
      <input className='search-bar' value={searchText} onChange={updateSearchText} placeholder="Search products..." />
      <div className='product-container'>
        {List.map((pro) => (
          <MyProCard key={pro._id} product={pro} />
        ))}
      </div>
    </div>
  );
}

export default MyProducts;
