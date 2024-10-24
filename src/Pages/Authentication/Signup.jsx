import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; 

const registerUser = async (userData) => {
    console.log(userData); // Log the user data before the request
    return await axios.post(`${API_URL}/register/`, userData);
};

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            alert('User registered successfully');
            // Reset the form fields
            setFormData({
                username: '',
                password: '',
                email: ''
            });
            console.log('Form reset:', formData); // Check if the form data is reset
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
          <div className="w-full text-center mt-12">
            <div className="text-center lg:text-left ">
              <h1 className="text-2xl font-bold text-center text-white lg:text-4xl py-5 mb-5">Sign Up</h1>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="card flex-shrink-0 bg-white drop-shadow-2xl rounded-xl shadow-2xl">
                <form onSubmit={handleRegister} className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xl font-medium">User Name</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="UserName" 
                        name="username" 
                        value={formData.username} // Link value to state
                        onChange={handleChange} 
                        className="input input-bordered" 
                        required 
                    />
                  </div>
    
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-xl font-medium">Email</span>
                    </label>
                    <input 
                        type="email" 
                        placeholder="email" 
                        name="email" 
                        value={formData.email} // Link value to state
                        onChange={handleChange} 
                        className="input input-bordered" 
                        required 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label ">
                      <span className="label-text text-xl font-medium">Password</span>
                    </label>
                    <input 
                        type="password" 
                        placeholder="password" 
                        name="password" 
                        value={formData.password} // Link value to state
                        onChange={handleChange} 
                        className="input input-bordered" 
                        required 
                    />
                  </div>
                  <div className="form-control mt-6">
                    <button className="grad-button btn text-xl text-white">Sign Up</button>
                  </div>
                </form>
                <div>
                  <p className="p-8 pt-0 text-xl font-medium">
                    Already have an account? <NavLink to="/signin" className="text-2xl font-semibold bg-grad-button">Login</NavLink> here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Register;
