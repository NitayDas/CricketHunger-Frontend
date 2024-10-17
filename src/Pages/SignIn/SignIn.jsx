import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import { BsGoogle } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {

   
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

        <div className="  shadow-drop">
            <div className="container   mx-auto"  >
                <h2 className="text-2xl font-bold text-black py-12 text-center   lg:text-4xl pt-2">Login Here !</h2>
                <div className="flex ">
                    <form onSubmit={handleLogin} className="py-5 flex-1" >
                        <div className="form-control drop-shadow px-12">
                            <label className="label">
                                <span className="label-text text-black ">Email</span>
                            </label>
                            <input type="text" name='email' placeholder="email" className="input rounded-none border-none border-transparent  bg-violet-200 drop-shadow text-black focus:outline-indigo-950 focus:bg-white" />
                        </div>

                      

                        <div className="form-control drop-shadow  px-12 ">
                            <label className="label">
                                <span className="label-text  text-black">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input rounded-none border-none border-transparent  bg-violet-200 drop-shadow text-black focus:outline-indigo-950 focus:bg-white" />

                            <p className="text-black py-3">New to the website? <span className="text-indigo-950"><Link to="/register">Sign Up</Link></span> here.</p>
                        </div>
                        
                        
                        <div className="form-control mt-2">
                            <input className="btn bg-indigo-950 mx-12 text-white drop-shadow hover:bg-white hover:text-cyan-600" type="submit" value="Login" />
                        </div>
                        
                    </form>

                    <div className="flex-1 h-full">
                        <img className="h-[430px]" src="https://i.postimg.cc/jSHMzwjw/1000-F-282091909-OKTHM5-TJG5-Fa-KYRklh8-IFL9073x-NSt-Bg-1-c0-ESK6-Vd-C-transformed.jpg" alt="" />
                    </div>
                </div>
            </div>

        </div>


    );
};

export default Login;