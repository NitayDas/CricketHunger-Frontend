import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import './navbar.css';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.log(error));
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false); // Close the dropdown
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
      {/* <div className="navbar-center hidden lg:flex">
        <ul className="menu font-semibold text-lg menu-horizontal px-1">{navOptions}</ul>
      </div> */}
      <div className="navbar-end">
        <ul className="hidden text-lg font-semibold lg:flex menu-horizontal px-1 gap-6">
          {navOptions}
        </ul>
        <ul>
          {user ? (
            <>
              <button onClick={handleLogOut} className="h-10 btn gard-bg ml-3">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">
                  <button className="h-10 btn gard-bg ml-3">Sign In</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
