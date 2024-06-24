import { Link } from 'react-router-dom';
import logo from '../logo.png';
import './Header.css';  // Ensure this path is correct

const Header = () => {
  return (
    <div className="fixed-header">
      <div id="navigation">
        <img src={logo} alt="Product Logo" className='logo' />
        <nav aria-label="Main navigation">
          <span>
            <Link to="/" className="Lin">Home</Link>
          </span>
          <span>
            <Link to="/add" className="Lin">Add</Link>
          </span>
          <span>
            <Link to="/login" className="Lin">Login</Link>
          </span>
          <span>
            <Link to="/profile" className="Lin">Profile</Link>
          </span>
        </nav>
      </div>
    </div>
  );
};

export default Header;
