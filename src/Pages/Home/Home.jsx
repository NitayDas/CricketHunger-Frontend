import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../Components/Card/Card';
import Top_Comments from './Top_Comments';
import Recent_Comments from './Recent_Comments';
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
    <div className='mt-5   '>
<div
  className="w-11/12 mx-auto overflow-x-auto"
  style={{
    scrollbarWidth: 'none',        
    msOverflowStyle: 'none',        
    WebkitOverflowScrolling: 'touch'   
  }}
>
  <div
    className="flex gap-2 pr-8"
    style={{
      minWidth: 'max-content'
    }}
  >
    {filtercards.map(card => (
      <div key={card.id} className="flex-shrink-0">
        <Card card={card} />
      </div>
    ))}
  </div>
</div>



        <div className="flex justify-center items-center mx-auto  lg:w-11/12 ">
        <div className="w-full mt-12  grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6  lg:grid-cols-2 lg:gap-10  ">
            {/* Top Comments Section */}
            <div className="w-full ">
                <Top_Comments />
            </div>

            {/* Top Comments Section */}
            <div className="w-full">
                <Recent_Comments/>
            </div>
        </div>
        </div>
       

         {/* home news section */}

         <div className="new-div text-white  mb-4 mt-10 rounded-lg  ">
            <NewsSection></NewsSection>
        </div>
     
    </div>
   
    );
};

export default Home;