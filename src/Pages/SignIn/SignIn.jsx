import { useContext, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const SignIn = () => {
    const location = useLocation(); 
    const navigate = useNavigate();  
    const { signIn } = useContext(AuthContext);  
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [password, setPassword] = useState(""); // State for password
    const from = location.state?.from?.pathname || "/";
    console.log('state in the location login page', location.state)

    // Handle form submission and user login
    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        
        console.log(email, password);
        
        signIn(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);

                toast.success("Signed in successfully!", {
                    autoClose: 1000, 
                    onClose: () => navigate(from, { replace: true }),
                });
            })
            .catch((error) => {
                toast.error(`Sign in failed: ${error.message}`, {
                  autoClose: 3000,
                  position: "top-right",
                });
                console.error('Sign in error:', error.message);
              });
    };

    // Handle password change
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div>
            <div className="w-full text-center mt-6 md:mt-8 lg:mt-12">
                <div className="text-center lg:text-left ">
                    {/* <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign In</h1> */}
                </div>
                <div className="flex justify-center items-center w-full">
                    <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl">
                        <form onSubmit={handleLogin} className="md:card-body lg:card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base font-semibold">Email</span>
                                </label>
                                <input type="email" placeholder="email" name="email" className="input input-bordered" required />
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
                                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <div className="form-control mt-6">
                                <button className="grad-button btn text-xl text-white">Sign In</button>
                            </div>
                        </form>
                        <div>
                            <p className="p-8 pt-0 text-base font-medium">
                                New to the website? <NavLink to="/signup" className="text-xl font-semibold bg-grad-button">Sign Up</NavLink> here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignIn;
