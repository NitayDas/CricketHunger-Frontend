// import jwtDecode from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken')); // Load token from localStorage
   
    useEffect(() => {
        if (token) {
            try {
                const userData = jwtDecode(token); 
                setUser(userData);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, [token]);
    
    console.log(user)
   

    const logOut = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token'); // Remove token on logout
    };

    return (
        <AuthContext.Provider value={{ user, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default Authprovider;
