import { useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";

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
        <div className="bg-gray-100 p-8 rounded-lg mt-12">
        <ul className="space-y-4">
            {matches.map(match => (
                <li key={match.match_id} className="border border-slate-300 rounded-lg p-4">
                    <Link to = {`/details/${match.match_id}`}><div className="flex font-semibold text-sm">
                    <p>{match.team1}</p><span className="ml-2 mr-2">vs</span><p>{match.team2}</p>
                    </div>
                    </Link>

                    <div className="flex">
                    <p className="text-sm text-gray-600 mr-4"> {match.venue}</p>
                    <p className="text-sm text-gray-600">
                        {new Date(match.start_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true  // Use `true` for 12-hour format, `false` for 24-hour format
                        })}
                    </p>
                    </div>
                    <p className="text-sm text-green-700">{match.status}</p>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default SeriesMatches;