import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';

const SignIn = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    // const { username, password } = formData;

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:8000/login/', formData);
          setMessage(response.data.message); // Update message on success
          navigate('/')
        } catch (error) {
          setMessage(error.response?.data?.error || 'Login failed'); // Update message on error
        }
      };
    
      

    return (
        <div className='mt-24 container-fluid  w-7/12 mx-auto bg-sky-300 p-8 shadow-lg rounded-md'>
            <h2 className='text-xl font-medium mb-4 ml-4'>Login</h2>
            <form onSubmit={onSubmit}>
                <input className="form-control w-7/12 block border rounded-lg px-4 py-2 mb-4" name="username" value={formData.username} onChange={onChange} placeholder="Username" /><br></br>
                <input className="form-control w-7/12 block border rounded-lg px-4 py-2 mb-4" name="password" value={formData.password} onChange={onChange} type="password" placeholder="Password" /><br></br>
                <button className='bg-indigo-600 btn btn-primary hover:bg-indigo-500 rounded-lg px-4 py-2 text-white font-medium mb-4' type="submit">sign in</button>
            </form>

            <Link to ="/signup"><button className="text-black hover:text-indigo-700 font-medium" >Do not have an account?</button></Link>
            {message && <p className="mt-4 text-green-500">{message}</p>} 
        </div>
    );
};

export default SignIn;