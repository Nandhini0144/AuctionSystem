import {Link} from 'react-router-dom'

const PurProCard=(props)=>{
const{product}=props;
return(
<div className="product-container">
<Link className="product-card" to={"/product/"+product._id}>
    <div>
    <img src={product.image} alt="Product" style={{ width: '100px', height: '100px' }} />
    <div>Name:{product.productName}</div>
    <div>Price:{product.currentBid}</div>
    </div>
</Link>
</div>)
}
export default PurProCard