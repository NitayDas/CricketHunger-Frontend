// DetailsPage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './details.css';
import CommentsSection from './CommentSection';

const DetailsPage = () => {
    const { match_id } = useParams();
    const [overSummary, setOverSummary] = useState([]);
    const [scoreboard1, setScoreboard1] = useState([]);
    const [scoreboard2, setScoreboard2] = useState([]);
    const [selectedOver, setSelectedOver] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/matchDetails/${match_id}/`);
                const { scoreboard, oversummary } = response.data;

                const sortedSummary = oversummary.sort((a, b) => a.OverNum - b.OverNum);
                const groupedSummary = sortedSummary.reduce((acc, item) => {
                    if (!acc[item.OverNum]) {
                        acc[item.OverNum] = [];
                    }
                    acc[item.OverNum].push(item);
                    return acc;
                }, {});

                setOverSummary(groupedSummary);
                setScoreboard1(scoreboard.filter(item => item.inningsId === "1"));
                setScoreboard2(scoreboard.filter(item => item.inningsId === "2"));
            } catch (error) {
                setError("There was an error fetching the scoreboard and over summary!");
            }
        };
        fetchMatchData();
    }, [match_id]);

    const latestOverNum = Math.max(...Object.keys(overSummary).map(Number));

    useEffect(() => {
        if (Object.keys(overSummary).length > 0) {
            setSelectedOver(latestOverNum);
        }
    }, [overSummary, latestOverNum]);

    const settings = {
        infinite: false,
        speed: 400,
        slidesToShow: Math.min(6, Object.keys(overSummary).length),
        slidesToScroll: 6,
        afterChange: (index) => {
            const overNums = Object.keys(overSummary);
            const selectedIdx = Math.min(index, overNums.length - 1);
            setSelectedOver(overNums[selectedIdx]);
        }
    };

    const handleOverClick = (overNum) => {
        setSelectedOver(overNum);
    };

    if (error) return <div>{error}</div>;

    const overSummaryId = overSummary[selectedOver]?.[0]?.id;

    return (
        <div className='mt-24 px-12'>
            {/* Scoreboard Section */}
            <div className='mt-24 px-12'>
                <div className='card w-[480px] h-[180px] bg-white shadow-lg border-2 p-2 m-3 rounded-lg'>
                    <div className="space-y-2 p-2">
                        {scoreboard1.map((item, index) => (
                            <div className='flex gap-8' key={index}>
                                <h2 className='text-lg text-blue-950 font-bold'>{item.bat_team}</h2>
                                <h2 className='text-lg text-blue-950 font-semibold'>{item.score}/{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                            </div>
                        ))}
                        {scoreboard2.map((item, index) => (
                            <div className='flex gap-8' key={index}>
                                <h2 className='text-lg text-blue-950 font-bold'>{item.bat_team}</h2>
                                <h2 className='text-lg text-blue-950 font-semibold'>{item.score}/{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overs Slider Section */}
            <div className='mt-24 px-12'>
                <Slider {...settings}>
                    {Object.keys(overSummary).map((overNum, index) => (
                        <div key={index} onClick={() => handleOverClick(overNum)}>
                            <h3 className={`rounded-full ${selectedOver == overNum ? 'bg-slate-800 py-3 text-xl' : 'bg-slate-600 py-2 text-lg'} text-white text-center mx-8 border border-gray-500`}>
                                {overNum}
                            </h3>
                        </div>
                    ))}
                </Slider>

                {/* Commentary Section */}
                {selectedOver && overSummary[selectedOver] && (
                    <div className='mt-12 p-4 rounded-lg shadow-sm'>
                        {overSummary[selectedOver].map((over, index) => (
                            <p key={index} className='text-lg font-semibold p-4 ml-8'>{over.commentary}</p>
                        ))}
                        
                        <CommentsSection overSummaryId={overSummaryId} />
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsPage;
