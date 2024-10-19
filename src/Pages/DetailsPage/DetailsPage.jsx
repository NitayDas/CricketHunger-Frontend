import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./details.css";
import CommentsSection from "./CommentSection";

const DetailsPage = () => {
  const { match_id } = useParams();
  console.log(match_id)
  const location = useLocation();
  const { team1, team2 } = location.state || {};

  const [overSummary, setOverSummary] = useState({});
  const [scoreboard1, setScoreboard1] = useState([]);
  const [scoreboard2, setScoreboard2] = useState([]);
  const [scoreboard3, setScoreboard3] = useState([]);
  const [scoreboard4, setScoreboard4] = useState([]);
  const [selectedOver, setSelectedOver] = useState(null);
  const [commentary, setCommentary] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/matchDetails/${match_id}/`
        );
        const { scoreboard, oversummary } = response.data;

        console.log(response.data);

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
        setSelectedOver(sortedSummary[sortedSummary.length - 1]?.OverNum);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "There was an error fetching the scoreboard and over summary!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [match_id]);

  useEffect(() => {
    if (selectedOver !== null) {
      const fetchCommentaryAndComments = async () => {
        try {
          const overData = overSummary[selectedOver];
          if (overData && overData.length > 0) {
            setCommentary(
              overData[0].commentary || "No commentary available for this over."
            );
            setComments(overData[0].comments || []);
          }
        } catch (error) {
          console.error("Error fetching commentary:", error);
        }
      };

      fetchCommentaryAndComments();
    }
  }, [selectedOver, overSummary]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const overNumbers = Object.keys(overSummary).map(Number);
  const latestOverNum = Math.max(...overNumbers);

  // Define how many slides (overs) to show at once
  const slidesToShow = Math.min(6, overNumbers.length);

  const handleOverClick = (overNum) => {
    setSelectedOver(overNum);

    // Access the over data for the clicked over
    const overData = overSummary[overNum];

    if (overData && overData.length > 0) {
      const commentsForOver = overData[0].comments || [];
      console.log(`Comments for Over ${overNum}:`, commentsForOver);
    } else {
      console.log(`No comments available for Over ${overNum}`);
    }
  };

  // Custom arrow for the slider
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
    infinite: true, // Keep infinite scrolling
    speed: 400,
    slidesToShow: slidesToShow, // Show the last 6 overs by default
    slidesToScroll: slidesToShow, // Scroll by 6 overs at a time
    initialSlide: overNumbers.length - slidesToShow, // Set initial slide to show the last 6 overs
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
  };

  return (
    <div className=" mt-8 mx-auto ">
         {/* Scoreboard Section */}
         <div className="px-10 flex justify-center items-center  mb-8">
          <div className="card w-[500px] h-[180px] bg-white shadow-lg border-2 p-2 m-3 rounded-lg">
            <div className="space-y-2 flex flex-col ml-4 p-4 h-full">
              {scoreboard1.map((item, index) => (
                <div className="flex gap-8 items-center" key={index}>
                  <h2 className="text-xl text-slate-700 font-bold">
                    {item.bat_team}
                  </h2>
                  <h2 className="text-xl text-slate-700 font-semibold">
                    {item.score}/{item.wickets}
                    <span className="ml-4">({item.overs})</span>
                  </h2>
                </div>
              ))}
              {scoreboard2.map((item, index) => (
                <div className="flex gap-8 items-center" key={index}>
                  <h2 className="text-xl text-slate-700 font-bold">
                    {item.bat_team}
                  </h2>
                  <h2 className="text-xl text-slate-700 font-semibold">
                    {item.score}/{item.wickets}
                    <span className="ml-4">({item.overs})</span>
                  </h2>
                </div>
              ))}

              {scoreboard3.map((item, index) => (
                <div className="flex gap-8 items-center" key={index}>
                  <h2 className="text-xl text-slate-700 font-bold">
                    {item.bat_team}
                  </h2>
                  <h2 className="text-xl text-slate-700 font-semibold">
                    {item.score}/{item.wickets}
                    <span className="ml-4">({item.overs})</span>
                  </h2>
                </div>
              ))}

              {scoreboard4.map((item, index) => (
                <div className="flex gap-8 items-center" key={index}>
                  <h2 className="text-xl text-slate-700 font-bold">
                    {item.bat_team}
                  </h2>
                  <h2 className="text-xl text-slate-700 font-semibold">
                    {item.score}/{item.wickets}
                    <span className="ml-4">({item.overs})</span>
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      
      <div className="container bg-white flex justify-center items-center rounded-3xl mx-auto">
        <div className="container  px-10 py-12 rounded-2xl">
          <div className="relative justify-center bg-white p-4 ml-6 mr-6 h-24 rounded-full drop-shadow-lg flex items-center">
            <div className="absolute -left-3 h-24 w-44 flex items-center justify-center bg-green-600 rounded-full text-white text-2xl font-bold">
              Over: {latestOverNum}
            </div>

            <div className="w-full">
              <Slider className="ml-56 drop-shadow-2xl" {...settings}>
                {overNumbers.map((overNum, index) => (
                  <div
                    key={index}
                    onClick={() => handleOverClick(overNum)}
                    className="cursor-pointer"
                  >
                    <h3
                      className={`rounded-full my-1 mx-1 flex items-center justify-center ${
                        selectedOver === overNum
                          ? "bg-green-400 h-20 w-20"
                          : "bg-white drop-shadow-2xl h-20 w-20"
                      } text-black font-semibold text-lg text-center`}
                    >
                      {overNum}
                    </h3>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Commentary Section */}
          <div className="commentary-section rounded-2xl  my-6 bg-white">
            <h3 className="text-2xl font-bold underline mt-2">Commentary</h3>
            <p className="text-black mt-4 text-lg">{commentary}</p>
          </div>

          <div className="details-container mt-6">
            {/* Comments Section */}
            <div className="comments-section drop-shadow-2xl ">
              <CommentsSection
                overSummaryId={overSummary[selectedOver]?.[0]?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
