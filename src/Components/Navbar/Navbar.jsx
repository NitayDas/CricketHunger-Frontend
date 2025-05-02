import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import './navbar.css';
import { FaUserCircle } from 'react-icons/fa'; // Import user icon

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false); // Close the mobile dropdown
    setIsUserDropdownOpen(false); // Close the user dropdown
  };

  const navOptions = (
    <>
      <li onClick={handleLinkClick}>
        <Link to="/">Home</Link>
      </li>
      <li onClick={handleLinkClick}>
        <Link to="/series">Series</Link>
      </li>
      <li onClick={handleLinkClick}>
        <Link to="/matches">Matches</Link>
      </li>
      <li onClick={handleLinkClick}>
        <Link to="/contact">Contact</Link>
      </li>
      <li onClick={handleLinkClick}>
        <Link to="/about">About</Link>
      </li>
      <li onClick={handleLinkClick}>
        <Link to="/report">Report</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 px-10 rounded-2xl">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            onClick={handleDropdownToggle}
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box absolute w-52"
            >
              {navOptions}
            </ul>
          )}
        </div>
        <a className="text-2xl font-bold text-with-gradient lg:text-3xl">
          Crickie Hunger
        </a>
      </div>
      <div className="navbar-end">
        <ul className="hidden text-lg font-semibold lg:flex menu-horizontal px-1 gap-6">
          {navOptions}
        </ul>
        <div className="">
        {user ? (
      <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn ml-2 btn-ghost btn-circle avatar">
        {user?.photoURL ? (
          <div className="w-10 rounded-full">
            <img src={user.photoURL} alt="User Profile" />
          </div>
        ) : (
          <FaUserCircle className="text-3xl text-gray-600" />
        )}
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow w-52"
      >
        <li className='text-lg font-semibold'>
          <Link className='text-md' to="/profile">Profile</Link>
        </li>
        <li className='text-lg font-semibold'>
          <button className='text-md' onClick={handleLogOut}>Logout</button>
        </li>
      </ul>
    </div>
    
        ) : (
          <Link to="/signin">
            <button className="h-10 btn gard-bg">Sign In</button>
          </Link>
        )}
      </div>
      </div>
    </div>
  );
};

export default Navbar;
