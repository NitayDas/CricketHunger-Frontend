
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './details.css'; // Ensure to import your custom styles

const DetailsPage = () => {
    const { match_id } = useParams();
    const location = useLocation();
    const { team1, team2 } = location.state  {};

    const [overSummary, setOverSummary] = useState([]);
    const [scoreboard1, setScoreboard1] = useState([]);
    const [scoreboard2, setScoreboard2] = useState([]);
    const [selectedOver, setSelectedOver] = useState(null);
    const [commentaryList, setCommentaryList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/matchDetails/${match_id}/`);
                console.log("Full API Response:", response);

                const { scoreboard, oversummary } = response.data;
                console.log("Scoreboard Data:", scoreboard);
                console.log("Oversummary Data:", oversummary);

                // Sorting and grouping oversummary by OverNum
                const sortedSummary = oversummary.sort((a, b) => a.OverNum - b.OverNum);
                const groupedSummary = sortedSummary.reduce((acc, item) => {
                    if (!acc[item.OverNum]) {
                        acc[item.OverNum] = [];
                    }
                    acc[item.OverNum].push(item);
                    return acc;
                }, {});

                console.log("Grouped Summary by OverNum:", groupedSummary);
                setOverSummary(groupedSummary);

                // Filter and set the scoreboard data for the two innings
                const s1 = scoreboard.filter(item => item.inningsId === "1");
                const s2 = scoreboard.filter(item => item.inningsId === "2");
                console.log("Scoreboard Innings 1:", s1);
                console.log("Scoreboard Innings 2:", s2);

                setScoreboard1(s1);
                setScoreboard2(s2);

            } catch (error) {
                console.error("There was an error fetching the scoreboard and over summary!", error);
                setError("There was an error fetching the scoreboard and over summary!");
            }
        };

        fetchMatchData();
    }, [match_id]);

    if (error) {
        return <div>{error}</div>;
    }

    // Retrieve over numbers from the grouped summary
    const overNumbers = Object.keys(overSummary).map(Number);

    // Calculate the latest over number
    const latestOverNum = Math.max(...overNumbers);

    // Get the last 6 overs
    const lastSixOvers = overNumbers.slice(-6);
    const slidesToShow = Math.min(6, lastSixOvers.length);

    const handleOverClick = (overNum) => {
        setSelectedOver(overNum);
        const commentaryData = overSummary[overNum]  [];
        const commentaries = commentaryData.map(item => item.commentary);
        setCommentaryList(commentaries);
    };

    const CustomArrow = ({ className, style, onClick, direction }) => (
        <div
            className={className}
            style={{
                ...style,
                display: "block",
                background: "black", 
                borderRadius: "50%", 
            }}
            onClick={onClick}
        />
    );

    const settings = {
        infinite: false,
        speed: 400,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        initialSlide: 0,
        nextArrow: <CustomArrow direction="next" />,
        prevArrow: <CustomArrow direction="prev" />,
    };


return (
        <div className='min-h-screen container rounded-2xl bg-white mt-8 mx-auto flex justify-center items-center'>
            <div className='container'>
                <div className='bg-white p-6 -mt-96 rounded-lg'>
                    <div className="flex justify-between items-center">
                        <div className="text-center">
                            <h2 className=' font-bold text-green-600 text-5xl'>{team1}</h2>
                        </div>
                        <div className="text-center">
                            <h1 className='text-7xl font-bold text-green-600'>𝓥𝓼</h1>
                        </div>
                        <div className="text-center">
                            <h2 className='font-bold text-green-600 text-5xl'>{team2}</h2>
                        </div>
                    </div>

                    <div className='mt-4'>
                        {scoreboard1.map((item, index) => (
                            <div className='flex justify-between text-xl font-semibold' key={index}>
                                <span>{item.bat_team}</span>
                                <span>{item.score}/{item.wickets} ({item.overs} overs)</span>
                            </div>
                        ))}
                        {scoreboard2.map((item, index) => (
                            <div className='flex justify-between text-xl font-semibold' key={index}>
                                <span>{item.bat_team}</span>
                                <span>{item.score}/{item.wickets} ({item.overs} overs)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Over selection carousel */}
                <div className='relative bg-white p-4 ml-6 mr-6 h-24 rounded-full drop-shadow-2xl flex items-center'>
                    <div className='absolute -left-3 h-24 w-44 flex items-center justify-center bg-green-600 rounded-full text-white text-2xl font-bold'>
                        Over: {latestOverNum} {/* Always display the latest over */}
                    </div>
                    
                    <div className='w-full'>
                        <Slider className='ml-56' {...settings}>
                            {overNumbers.map((overNum, index) => (
                                <div key={index} onClick={() => handleOverClick(overNum)} className='cursor-pointer'>
                                    <h3 className={`rounded-full mx-1 px-2 py-2 ${
                                        overNum === latestOverNum ? 'bg-green-400 h-20 w-20' : // Last over always green
                                        selectedOver === overNum ? 'bg-orange-400 h-20 w-20' : // Selected over orange
                                        'bg-slate-600 h-20 w-20' // Default grey
                                    } text-white text-lg text-center`}>
                                        {overNum}
                                    </h3>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>


{/* Commentary and Comment Box */}
                <div className='flex mt-12 p-4 bg-white rounded-lg shadow-md'>
                    <div className='w-1/2 p-4'>
                        {commentaryList.length > 0 ? (
                            commentaryList.map((commentary, index) => (
                                <p key={index} className='text-lg font-semibold p-4 border-b border-gray-300'>
                                    {commentary}
                                </p>
                            ))
                        ) : (
                            <p className='text-lg font-semibold'>No commentary available for this over.</p>
                        )}
                    </div>
                    <div className='w-1/2 p-4'>
                        <textarea
                            className='w-full h-40 p-4 border-2 border-gray-300 rounded-lg'
                            placeholder='Add your comment...'
                        />
                        <button className='mt-4 px-4 py-2 bg-green-600 text-white rounded-lg'>
                            Submit Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;