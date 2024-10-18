import { Link } from 'react-router-dom';
import './navbar.css'
import { useContext } from 'react';
import  { AuthContext } from '../../Provider/AuthProvider';

const Navbar = () => {

  const { user, logOut } = useContext(AuthContext);
  console.log(user);
  

  const handleLogOut = () => {
    logOut()
        .then(() => { })
        .catch(error => console.log(error));
}

const navOptions = <>
<li><Link to="/">Home</Link></li>
<li><Link to="/series">Series</Link></li>
<li><Link to="/matches">Matches</Link></li>
<li><Link to="/contact">Contact</Link></li>
<li><Link to="/about">About</Link></li>


</>


    return (
        <div className='rounded-xl'>
     < div className="navbar bg-base-100 px-10 rounded-2xl">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <a className="text-3xl font-bold text-with-gradient">Crickie Hunger</a>
  </div>
  <div className="navbar-center hidden   lg:flex  ">
  <ul className='menu font-semibold text-lg menu-horizontal px-1'>

  </ul>
  </div>
  <div className="navbar-end">
  <ul className="menu font-semibold text-lg menu-horizontal px-1">
  {navOptions}
   
    </ul>
   <ul>
   {
    user ? <>
        {/* <span>{user?.displayName}</span> */}
        <button onClick={handleLogOut} className="h-10 btn gard-bg ">Sign Out</button>
    </> : <>
        <li><Link to="/signin"><button className='h-10 btn  gard-bg'>Sign In</button></Link></li>
    </>
}
   </ul>
  </div>
</div>
        </div>
    );
};

export default Navbar;