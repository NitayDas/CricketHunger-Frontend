import { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { BsGoogle } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const SignIn = () => {

   
    const location = useLocation()
    console.log('location in login page', location)
    const navigate = useNavigate()
    const { signIn, loading } = useContext(AuthContext)


    const handleLogin = async (e) => {
      e.preventDefault();
      const form = new FormData(e.target);
      const email = form.get('email');
      const password = form.get('password');
  
      try {
          await signIn(email, password);
          navigate(location?.state ? location.state : '/');
      } catch (error) {
          console.error("Login Error:", error.message);
          toast.error(error.message);
      }
  };
    return (

      <div>
      <div className="w-full  text-center mt-12">

        <div className="text-center lg:text-left ">
          <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign In</h1>

        </div>
        <div className="flex justify-center items-center  w-full">
          <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl">
            <form onSubmit={handleLogin} className="card-body  ">



              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xl font-medium">Email</span>
                </label>
                <input type="email" placeholder="email" name="email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label ">
                  <span className="label-text text-xl font-medium">Password</span>
                </label>
                <input type="password" placeholder="password" className="input input-bordered" name="password" required />
               
              </div>
              <div className="form-control mt-6">
              <div className="form-control mt-6">
    <button className="grad-button btn text-xl text-white">Sign In</button>
</div>
              </div>
            </form>
            <div>
              <p className="p-8 pt-0 text-xl font-medium">New to the website? <NavLink to="/signup" className="text-2xl font-semibold bg-grad-button">Sign Up</NavLink> here.</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>


    );
};

export default SignIn;