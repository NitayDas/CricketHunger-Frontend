import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";

const SeriesMatches = () => {
    const [matches, setMatches] = useState([]);
    const { seriesId } = useParams();
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`http://localhost:8000/seriesMatches/${seriesId}/`);
                const matches = await response.json();
                setMatches(matches || []); 
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        if (seriesId) {
            fetchMatches();
        }
    }, [seriesId]);

    return (
        <div>
             <ul>
                {matches.map(match => (
                    <li key={match.match_id}> {/* Assuming match_id is unique */}
                        <h3>{match.match_type}</h3>
                        <p>Match ID: {match.match_id}</p>
                        <p>Series Name: {match.series_name}</p>
                        {/* Add more match details as needed */}
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default SeriesMatches;