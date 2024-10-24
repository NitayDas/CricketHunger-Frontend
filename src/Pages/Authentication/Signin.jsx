import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';   // Adjust based on your actual endpoint

const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/token/`, credentials);  // Assuming you're using SimpleJWT
};

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [token, setToken] = useState(null);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            setToken(response.data.access);
            localStorage.setItem('accessToken', response.data.access);  // Store token for persistence
            alert('Logged in successfully');
            setCredentials({
                username: '',
                password: '',
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div>
            <div className="w-full text-center mt-12">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign In</h1>
                </div>
                <div className="flex justify-center items-center w-full">
                    <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl">
                        <form onSubmit={handleSubmit} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl font-medium">Username</span>
                                </label>
                                <input type="text" placeholder="username" name="username" value={credentials.username} onChange={handleChange} className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl font-medium">Password</span>
                                </label>
                                <input type="password" placeholder="password" value={credentials.password} onChange={handleChange} className="input input-bordered" name="password" required />
                            </div>
                            <div className="form-control mt-6">
                                <button className="grad-button btn text-xl text-white">Sign In</button>
                            </div>
                        </form>
                        <div>
                            <p className="p-8 pt-0 text-xl font-medium">
                                New to the website? <NavLink to="/signup" className="text-2xl font-semibold bg-grad-button">Sign Up</NavLink> here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
