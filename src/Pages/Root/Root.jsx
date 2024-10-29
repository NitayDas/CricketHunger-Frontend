
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer';

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen">
        <div className="flex-grow p-8">
          <Navbar />
          <Outlet />
        </div>
        <Footer />
      </div>
    );
};

export default Root;