import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./details.css";
import CommentsSection from "./CommentSection";
import ScoreboardItem from './ScoreboardItem';
import Striker from './Striker';

const DetailsPage = () => {
    const { match_id } = useParams();
    const location = useLocation();
    const { over_num, InningsId } = location.state || {};
    console.log(over_num);
    console.log(InningsId);
    const [overSummary, setOverSummary] = useState([]);
    const [scoreboard1, setScoreboard1] = useState([]);
    const [scoreboard2, setScoreboard2] = useState([]);
    const [scoreboard3, setScoreboard3] = useState([]);
    const [scoreboard4, setScoreboard4] = useState([]);
    const [status, SetStatus] = useState('');
    const [series_name, setSeriesName] = useState('');
    const [error, setError] = useState(null);
    const [searchOver, setSearchOver] = useState("");
    const [selectedOver, setSelectedOver] = useState(null);
    const sliderRef = useRef(null);
    

    
    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/matchDetails/${match_id}/`,{innings_id : InningsId});
                const { scoreboard, oversummary, match_info } = response.data;
                const [match_status, series_name] = match_info.split(' --- ');
                SetStatus(match_status);
                setSeriesName(series_name);
                console.log(match_status);
                console.log(series_name);

                const sortedSummary = oversummary.sort((a, b) => {
                    return a.OverNum - b.OverNum; // No need to parse, as OverNum is already a float
                });
                
                const groupedSummary = sortedSummary.reduce((acc, item) => {
                    const overNumKey = item.OverNum.toFixed(1); // Use toFixed(1) to handle float precision
                    if (!acc[overNumKey]) {
                        acc[overNumKey] = [];
                    }
                    acc[overNumKey].push(item);
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
    }, [match_id,InningsId]);

    if (error) {
        return <div>{error}</div>;
    }

    const allScoreboards = [...scoreboard1, ...scoreboard2, ...scoreboard3, ...scoreboard4];


    //Slider part
    const latestOverNum = Object.keys(overSummary).length > 0 
    ? Math.max(...Object.keys(overSummary).map(Number)) 
    : "0";
   
    const overnum = over_num ? over_num : latestOverNum;
    console.log(overnum)

    const OverIndex =  Object.keys(overSummary).indexOf(overnum.toString());

    console.log(OverIndex);

    useEffect(() => {

        if (sliderRef.current) {
            sliderRef.current.slickGoTo(OverIndex);
        }

        if (Object.keys(overSummary).length > 0) {
            setSelectedOver(overnum);
        }
    },[overSummary,OverIndex,overnum]);

    
    //search handle
    const handleSearch = () => {
        const SearchIndex = Object.keys(overSummary).indexOf(searchOver.toString());

        if (SearchIndex !== -1 && sliderRef.current) {
            sliderRef.current.slickGoTo(SearchIndex);
        }

        if (searchOver && overSummary[searchOver]) {
            setSelectedOver(searchOver);
        } 

        setSearchOver("");
    };


    const slidesToShow = Math.min(6, Object.keys(overSummary).length);

    const settings = {
        infinite: false,
        speed: 400,
        slidesToShow: slidesToShow,
        slidesToScroll: 6,
        //initialSlide : 400,
        afterChange: (index) => {
            const overNums = Object.keys(overSummary);
            const selectedIdx = Math.min(index, overNums.length - 1);
            setSelectedOver(overNums[selectedIdx]);
        }
    };


    const handleOverClick = (overNum) => {
        setSelectedOver(overNum);
    };

    
    return (
        <div className='mt-8 lg:mt-24 lg:px-12 '>
            <div className='w-full flex justify-left lg:mt-24 lg:px-12'>
                <div className='card w-60 bg-white shadow-lg border-2 h-auto rounded-lg md:w-72 lg:w-72'>
                    <div className="space-y-2 p-2">
                        <div className="flex mb-3">
                            <h1 className="text-sm text-slate-700 whitespace-nowrap overflow-hidden">{series_name}</h1>
                        </div>
                        <div className='space-y-2 '>

                        {
                        allScoreboards.map((item, index) => (
                        <ScoreboardItem key={index} item={item} />
                        ))}
                        
                         <p className='text-sm text-slate-650'>{status}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='justify-left mt-2 lg:px-12'>
                <Striker match_id={match_id} />
            </div>

            

            {/* Search OverSummary by ID */}
            <div className="mt-8 mb-4 lg:mt-24 ml-8 ">
                <input
                    type="text"
                    value={searchOver}
                    onChange={(e) => setSearchOver(e.target.value)}
                    placeholder="Enter Over"
                    className="p-3 border rounded-xl text-center font-semibold"
                />
                <button onClick={handleSearch} className="ml-1 p-3 btn grad-bg text-black rounded-xl">Search</button>
            </div>


        {/*slider*/}
        <div className="relative justify-center bg-white p-2 mb-12 h-18 rounded-full drop-shadow-lg flex items-center"> 
            <div className="absolute hidden -left-2 h-16 w-32 md:flex items-center justify-center bg-green-600 rounded-full text-white text-xl font-semibold">
               Over: {latestOverNum}
            </div>

            <div className='w-full'>
            <Slider className='ml-44 drop-shadow-2xl h-16' ref={sliderRef} {...settings}>
                {Object.keys(overSummary).map((overNum, index) => (
                    <div key={index} onClick={() => handleOverClick(overNum)} className='cursor-pointer'>
                        <h3 className={`${selectedOver == overNum ? 'bg-green-400 h-16 w-16' : 'bg-white drop-shadow-lg h-16 w-16'} text-black font-semibold text-lg text-center rounded-full my-1 mx-4 flex items-center justify-center`}>
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