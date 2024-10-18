import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { getAuth,updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signUp.css'


const SignUp = () => {
  
  const location = useLocation()
  const navigate=useNavigate()
  const auth = getAuth();
  const { createUser, updateUserProfile } = useContext(AuthContext);


  const handleRegister = e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const userName = form.get('userName');
    const email = form.get('email');
    const password = form.get('password');

    // Set the default photo URL
    const photo = 'https://i.ibb.co.com/TbXqH0L/user-removebg-preview.png';

    // Username validation
  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,14}$/;
  if (!userNameRegex.test(userName)) {
    toast.error('Username must be 3-15 characters long and can contain letters, numbers, underscores, and hyphens. It must start with a letter.');
    return;
  }

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password should contain at least one capital letter');
      return;
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      toast.error('Password should contain at least one special character');
      return;
    }

   // Create the new user
   createUser(email, password) // Only pass email and password
   .then(() => {
     // After creating the user, update the profile
     return updateUserProfile(userName, photo);
   })
   .then(() => {
     toast.success('Registration Successful');
     navigate(location?.state || '/');
   })
   .catch(error => {
     toast.error(error.message);
     console.error("Registration error:", error.message);
   });
};

  
  return (
    <div>
      <div className="w-full  text-center mt-12">

        <div className="text-center lg:text-left ">
          <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign Up</h1>

        </div>
        <div className="flex justify-center items-center  w-full">
          <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl">
            <form onSubmit={handleRegister} className="card-body  ">

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xl font-medium">User Name</span>
                </label>
                <input type="text" placeholder="UserName" name="userName" className="input input-bordered" required />
              </div>
{/*               
              <div className="form-control">
              <label className="label">
                  <span className="label-text text-xl font-medium">Photo URL</span>
                </label>
                <input type="text" placeholder="photo URL" name="photo" className="input input-bordered " required  />
              </div> */}

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
    <button className="grad-button btn text-xl text-white">Sign Up</button>
</div>
              </div>
            </form>
            <div>
              <p className="p-8 pt-0 text-xl font-medium">Already have an account? <NavLink to="/signin" className="text-2xl font-semibold bg-grad-button">Login</NavLink> here.</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;