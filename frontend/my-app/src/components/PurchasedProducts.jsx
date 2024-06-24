import React, { useState, useEffect,useContext} from 'react';
import PurProCard from './purchasedProductsCard';
import axios from 'axios';
import {DomainContext } from '../App';

const PurchasedProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [List,setList]=useState([])
  const url=useContext(DomainContext);
  
  useEffect(() => {
    fetchData();
  }, []);   

  const fetchData = async () => {
    try {
      const result = await axios.get(`${url}/api/user/purchasedProducts`);
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
    <div className='purchasedProduct-container'>
      <input value={searchText} onChange={updateSearchText} placeholder="Search products..." />
      <div className='product-container'>
        {List.map((pro) => (
          <PurProCard key={pro._id} product={pro} />
        ))}
      </div>
    </div>
  );
}

export default PurchasedProducts;