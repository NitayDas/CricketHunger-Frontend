import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../Components/Card/Card';
import NewsSection from '../../Components/NewsSection/NewsSection';


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
                <div className="carousel-item  mx-4" key={card.id}>
                    <Card card={card} />
                </div>
            ))}
        </div>

         {/* home news section */}
        <NewsSection></NewsSection>
    </div>

        

        
    );
};

export default Home;