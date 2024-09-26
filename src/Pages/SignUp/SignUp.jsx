import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register/', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    }
  };

    return (
        <div className='mt-24 container-fluid  w-7/12 mx-auto bg-sky-300 p-8 shadow-lg rounded-md'>
            <h2 className='text-xl font-medium mb-4'>Sign Up</h2>
            <form onSubmit={onSubmit}>
                <input className="form-control w-7/12 block border rounded-lg px-4 py-2 mb-4" name="username" value={formData.username} onChange={onChange} placeholder="Username" />
                <input className="form-control w-7/12 block border rounded-lg px-4 py-2 mb-4" name="email" value={formData.email} onChange={onChange} placeholder="Email" />
                <input className="form-control w-7/12 block border rounded-lg px-4 py-2 mb-4" name="password" value={formData.password} onChange={onChange} type="password" placeholder="Password" />
                <button className='bg-indigo-600 btn btn-primary hover:bg-indigo-500 rounded-lg px-4 py-2 text-white font-medium mb-4'  type="submit">Sign Up</button>
            </form>
            <Link to ="/signin"><button className="text-black  hover:text-indigo-700 font-medium" >Already Registered?</button></Link>
            {message && <p className="mt-4 text-green-500">{message}</p>} {/* Display the message */}
        </div>
    );
};

export default SignUp;
