import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import './signUp.css';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const { createUser, updateUserProfile } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [validations, setValidations] = useState({
    hasCapital: false,
    hasSpecialChar: false,
    hasDigit: false,
    minLength: false,
  });
  const [username, setUsername] = useState(''); // State for username
  const [usernameError, setUsernameError] = useState(''); 
  const [formError, setFormError] = useState(''); 

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUsername(value); // Update username state

    // Validate username in real-time
    const userNameRegex = /^[a-z][a-zA-Z0-9_-]{2,14}$/;
    if (!userNameRegex.test(value)) {
      setUsernameError('Username must be 3-15 characters, start with a small letter, and can include letters, numbers, underscores, or hyphens.');
    } else {
      setUsernameError('');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    const photo = 'https://i.ibb.co.com/TbXqH0L/user-removebg-preview.png';

    // Check if all password validations are met
    if (!validations.minLength || !validations.hasCapital || !validations.hasSpecialChar || !validations.hasDigit) {
      setFormError('Please ensure the password meets all the requirements.');
      return;
    } else {
      setFormError(''); 
    }

    // Proceed with registration
    createUser(email, password)
      .then(() => {
        return updateUserProfile(username, photo);
      })
      .then(() => {
        toast.success('Registration Successful', {
          autoClose: 3000,
          onClose: () => navigate(location?.state || '/signin', { replace: true }),
        });
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message}`, {
          autoClose: 3000,
          position: "top-right",
        });
        console.error('Registration error:', error.message);
      });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Update validation state based on the input
    setValidations({
      hasCapital: /[A-Z]/.test(value),
      hasSpecialChar: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value),
      hasDigit: /[0-9]/.test(value),
      minLength: value.length >= 6,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div className="w-full text-center mt-14 mb-10 ">
        <div className="text-center lg:text-left">
          {/* <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign Up</h1> */}
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl px-5">
            <form onSubmit={handleRegister} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">User Name</span>
                </label>
                <input
                  type="text"
                  placeholder="userName"
                  name="userName"
                  className="input input-bordered"
                  value={username} 
                  onChange={handleUserNameChange} 
                  required
                />
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  name="email"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control relative">
                <label className="label">
                  <span className="label-text text-base font-semibold">Password</span>
                </label>
                <input
                  type={passwordVisible ? "text" : "password"} 
                  placeholder="password"
                  className="input input-bordered"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {/* Eye icon for password visibility */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="password-requirements mt-2">
                <h3 className="text-lg font-medium text-start">Password must include:</h3>
                <div className="flex items-center mt-2">
                  <input type="checkbox" readOnly checked={validations.minLength} />
                  <label className="ml-2 text-sm">At least 6 characters</label>
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" readOnly checked={validations.hasCapital} />
                  <label className="ml-2 text-sm">At least one capital letter</label>
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" readOnly checked={validations.hasSpecialChar} />
                  <label className="ml-2 text-sm">At least one special character</label>
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" readOnly checked={validations.hasDigit} />
                  <label className="ml-2 text-sm">At least one digit</label>
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-sm mt-2">{formError}</p> 
              )}

              <div className="form-control mt-4">
                <button className="grad-button btn text-xl text-white" disabled={usernameError || formError}>
                  Sign Up
                </button>
              </div>
            </form>
            <div>
              <p className="p-8 pt-0 text-base font-medium">
                Already have an account? <NavLink to="/signin" className="text-xl font-semibold bg-grad-button">Sign In</NavLink> here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
