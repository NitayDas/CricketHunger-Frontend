import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./details.css";
import CommentsSection from "./CommentSection";

const DetailsPage = () => {
    const { match_id } = useParams();
    const [overSummary, setOverSummary] = useState([]);
    const [scoreboard1, setScoreboard1] = useState([]);
    const [scoreboard2, setScoreboard2] = useState([]);
    const [scoreboard3, setScoreboard3] = useState([]);
    const [scoreboard4, setScoreboard4] = useState([]);
    const [status, SetStatus] = useState([]);
    const [selectedOver, setSelectedOver] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/matchDetails/${match_id}/`);
                const { scoreboard, oversummary, match_status } = response.data;
                SetStatus(match_status);

                const sortedSummary = oversummary.sort((a, b) => a.OverNum - b.OverNum);
                const groupedSummary = sortedSummary.reduce((acc, item) => {
                    if (!acc[item.OverNum]) {
                        acc[item.OverNum] = [];
                    }
                    acc[item.OverNum].push(item);
                    return acc;
                }, {});

                setOverSummary(groupedSummary);

                setScoreboard1(scoreboard.filter((item) => item.inningsId === "1"));
                setScoreboard2(scoreboard.filter((item) => item.inningsId === "2"));
                setScoreboard3(scoreboard.filter((item) => item.inningsId === "3"));
                setScoreboard4(scoreboard.filter((item) => item.inningsId === "4"));
            } catch (error) {
                setError("There was an error fetching the scoreboard and over summary!");
                console.error("There was an error fetching the scoreboard and over summary!", error);
            }
        };

        fetchMatchData();
    }, [match_id]);

    if (error) {
        return <div>{error}</div>;
    }

    const latestOverNum = Math.max(...Object.keys(overSummary).map(Number));

    useEffect(() => {
        if (Object.keys(overSummary).length > 0) {
            setSelectedOver(latestOverNum);
        }
    }, [overSummary, latestOverNum]);

    const slidesToShow = Math.min(6, Object.keys(overSummary).length);
  

    const settings = {
        infinite: false,
        speed: 400,
        slidesToShow: slidesToShow,
        slidesToScroll: 6,
        initialSlide : 400,
        afterChange: (index) => {
            const overNums = Object.keys(overSummary);
            const selectedIdx = Math.min(index, overNums.length - 1);
            setSelectedOver(overNums[selectedIdx]);
        }
    };

    const handleOverClick = (overNum) => {
        setSelectedOver(overNum);
    };

    const handleNumClick = (overNum) => {
        setSelectedOver(overNum);
    };

    return (
        <div className='mt-24 px-12 '>
            <div className='mt-24 px-12'>
                <div className='card w-[480px] h-[220px] bg-white shadow-lg border-2 p-2 m-3 rounded-lg'>
                    <div className="space-y-2 p-2">
                        <div className="flex">
                            <h1 className="text-xs mr-1 font-semibold whitespace-nowrap overflow-hidden"><span className="font-semibold"></span></h1>
                            <h1 className="text-xs text-slate-700 whitespace-nowrap overflow-hidden">series_name</h1>
                        </div>
                        <div className='space-y-2'>
                            {scoreboard1.map((item, index) => (
                                <div className='flex gap-8 items-center text-slate-700 ' key={index}>
                                    <h2 className='text-sm font-bold'>{item.bat_team}</h2>
                                    <h2 className='text-sm  font-bold'>{item.score}/{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                                </div>
                            ))}
                            {scoreboard2.map((item, index) => (
                                <div className='flex gap-8 items-center text-slate-700 ' key={index}>
                                    <h2 className='text-sm  font-bold'>{item.bat_team}</h2>
                                    <h2 className='text-sm  font-bold'>{item.score}/{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                                </div>
                            ))}

                            {scoreboard3.map((item, index) => (
                                <div className='flex gap-8 items-center text-slate-700' key={index}>
                                    <h2 className='text-sm  font-bold'>{item.bat_team}</h2>
                                    <h2 className='text-sm  font-bold'>{item.score}-{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                                </div>
                            ))}

                          {scoreboard4.map((item, index) => (
                                <div className='flex gap-8 items-center text-slate-700' key={index}>
                                    <h2 className='text-sm font-bold'>{item.bat_team}</h2>
                                    <h2 className='text-sm  font-bold'>{item.score}/{item.wickets}<span className='ml-4'>({item.overs})</span></h2>
                                </div>
                            ))}
                         <p className='text-sm text-slate-650'>{status}</p>
                        </div>
                    </div>
                </div>
            </div>


        
        <div className="relative justify-center bg-white p-4 my-6 h-24 rounded-full drop-shadow-lg flex items-center"> 
            <div className="absolute -left-2 h-16 w-32 flex items-center justify-center bg-green-600 rounded-full text-white text-xl font-semibold">
               Over: {latestOverNum}
            </div>

            <div className='w-full'>
                <Slider className='ml-44 drop-shadow-2xl' {...settings}>
                    {Object.keys(overSummary).map((overNum, index) => (
                        <div key={index} onClick={() => handleOverClick(overNum)} className='cursor-pointer'>
                            <h3 className={`${ selectedOver == overNum ?  'bg-green-400 h-20 w-20'  : 'bg-white drop-shadow-lg h-20 w-20'}  text-black font-semibold text-lg text-center rounded-full my-1 mx-4 flex items-center justify-center`} onClick={() => handleNumClick(overNum)}>
                                 {overNum}
                            </h3>
                        </div>
                    ))}
                </Slider>
            </div>
            </div>

            {selectedOver && overSummary[selectedOver] && (
                    <div className='mt-12'>
                        {overSummary[selectedOver].map((over, index) => (
                            <p key={index} className='text-lg font-semibold p-4 ml-8'>{over.commentary}</p>
                        ))}
                    </div>
            )}


            <div className="details-container mt-6">
            {/* Comments Section */}
            <div className="comments-section drop-shadow-2xl ">
              <CommentsSection
                overSummaryId={overSummary[selectedOver]?.[0]?.id}
              />
            </div>
            </div>

        </div>
      
    );
};

export default DetailsPage;