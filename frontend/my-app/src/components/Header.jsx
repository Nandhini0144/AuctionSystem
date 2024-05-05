import {Link} from 'react-router-dom'
import logo from '../logo.png'
const Header = () => {
    return (
      <div id='navigation'>
        <img src={logo} alt="Product" style={{ width: '110px', height: '100px' }} />
        <nav>
          <span>
            <Link to="/">Home</Link></span>
            <span>
            <Link to="/add">Add</Link></span>
            <span>
            <Link to="/login">Login</Link></span>
            <span>
            <Link to="/profile">Profile</Link></span>
            
        </nav>
      </div>
    )
  }
  export default Header