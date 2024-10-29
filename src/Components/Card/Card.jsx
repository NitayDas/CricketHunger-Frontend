import { Link } from 'react-router-dom';

const Card = ({card}) => {
    const over_num = null;
    const {match_id,team1,match_description, team2, status, venue,series_name}=card;
    return (
       <Link to={`/details/${match_id}`}>
        <div className='card w-80 h-40 bg-white shadow-lg border-2 p-2 m-3 rounded-lg'>
            <div className="space-y-2">
                <div className="flex">
                    <h1 className="text-xs mr-1 font-semibold whitespace-nowrap overflow-hidden">{match_description}<span className="font-semibold">.</span></h1>
                    <h1 className="text-xs text-slate-700 whitespace-nowrap overflow-hidden">{series_name}</h1>
                </div>
                <h1 className="text-xs text-slate-600">{venue}</h1>
                <div className=''>
                    <h2 className='text-sm text-blue-950 font-semibold pb-1'>{team1}</h2>
                    <h2 className='text-sm text-blue-950 font-semibold'>{team2}</h2>
                </div>
                <h2 className="text-xs text-slate-900 font-medium">{status}</h2>
            </div>
        </div>
        </Link>
    );
};

export default Card;

