import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Series = () => {
    const [series, setSeries] = useState([]);

    useEffect (()=> {
        axios.get('http://localhost:8000/series/')

        .then(response =>{
            setSeries(response.data);
        })

        .catch(error => {
            console.error('There was an error fetching the series!', error);
        });

    },[]);

    return (
        <div className="min-h-screen mt-8 py-8 px-4">
        <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
            {series.map(item => (
                <div key={item.series_id} className="mb-4 border-b border-slate-300">
                    <h2 className="text-lg font-semibold text-gray-700 ">
                       <Link to={`/seriesmatches/${item.series_id}`} className="hover:text-gray-900">
                        {item.series_name}
                        </Link>
                    </h2>
                    <p className='mb-2'>
                     <span className="text-sm font-medium text-slate-500 ">
                        {new Date(item.start_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',  
                            day: 'numeric'
                        })} <span className='ml-2 mr-2'>-</span>
                        {new Date(item.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',  
                            day: 'numeric'
                        })}
                      </span>
                    </p>
                   
                </div>
            ))}
            </div>
        </div>
     );
};

export default Series;