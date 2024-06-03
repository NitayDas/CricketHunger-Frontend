import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../Components/Card/Card';


const Home = () => {

    const [cards, setMatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/matches/');
            setMatches(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(cards);
    }, [cards]); 


    const filterMatches=(matches)=>{
        return matches.filter(match => (match.match_type === 'International' || match.match_type === 'League') && match.state !== 'Upcoming');
    };

    let filtercards=filterMatches(cards);

    return (
    <div className='px-10 mt-5'>
        <div className="carousel rounded-box container mx-5">
            {filtercards.map(card => (
                <div className="carousel-item" key={card.id}>
                    <Card card={card} />
                </div>
            ))}
        </div>

         {/* home news section */}
         <div className="new-div bg-sky-500 text-white p-4 mb-4 mt-10 mr-5 rounded-lg">
            <div className='text-white p-2 mx-4 my-4'>
                <div className='flex '>
                <p className='text-sm font-medium'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta eius voluptates distinctio quo amet quos quae dolore reprehenderit
                 consequuntur, nulla odio? Dignissimos cum officia nemo ipsum dolorum delectus modi earum ex doloribus consequatur quae inventore veniam, aliquidnostrum reiciendis, 
                 quasi  quo eum tempora explicabo.</p>
                 </div>
            </div>

            <div className='text-white p-2 mx-4 my-4'>
                <p className='text-sm font-medium'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta eius voluptates distinctio quo amet quos quae dolore reprehenderit
                 consequuntur, nulla odio? Dignissimos cum officia nemo ipsum dolorum delectus modi earum ex doloribus consequatur quae inventore veniam, aliquidnostrum reiciendis, 
                 quasi  quo eum tempora explicabo.</p>
            </div>
        </div>
    </div>

        

        
    );
};

export default Home;