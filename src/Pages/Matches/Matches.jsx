import { useState, useEffect } from 'react'
import axios from 'axios'
import MatchesContainer from '../../Components/MatchesContainer/MatchesContainer';

function Matches(){

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

  return (
    <div>
        <MatchesContainer cards={cards} ></MatchesContainer>
    </div>
  );
}

export default Matches;