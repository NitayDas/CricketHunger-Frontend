import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './details.css'; 

const fetchComments = async(overSummaryId)=>{
    const response = await axios.get(`http://127.0.0.1:8000/comments/${overSummaryId}/`);
    return response.data;
};


const postComment = async({ overSummaryId, commentData }) => {
    const response = await axios.post(`http://127.0.0.1:8000/comments/${overSummaryId}/`, commentData);
    return response.data;
};


const DetailsPage = () => {
    const { match_id } = useParams();
    const [overSummary, setOverSummary] = useState([]);
    const [scoreboard1, setScoreboard1] = useState([]);
    const [scoreboard2, setScoreboard2] = useState([]);
    const [selectedOver, setSelectedOver] = useState(null);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState("");
    const [username, setUsername] = useState(''); 
    // const [comments, setComments] = useState([]); 
    const queryClient = useQueryClient();
    // const [socket, setSocket] = useState(null);
    console.log(queryClient);

    const overSummaryId = overSummary[selectedOver]?.[0]?.id;
    

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

                const s1 = scoreboard.filter(item => item.inningsId === "1");
                setScoreboard1(s1);
                const s2 = scoreboard.filter(item => item.inningsId === "2");
                setScoreboard2(s2);

            } catch (error) {
                setError("There was an error fetching the scoreboard and over summary!");
                console.error("There was an error fetching the scoreboard and over summary!", error);
            }
        };

        fetchMatchData();
    }, [match_id]);


    
    const { data: comments = [], isLoading, isError } = useQuery({
        queryKey: ['comments',overSummaryId], 
        queryFn: () => fetchComments(overSummaryId), 
        enabled: overSummaryId !== null, // Only run if we have a valid ID
        refetchOnWindowFocus: false,
    });
    
    const mutation = useMutation({
        mutationFn: ( commentData ) =>{
                return postComment({ overSummaryId, commentData});
            },
        onSuccess: () => {
            queryClient.invalidateQueries(['comments']);
        }
    });


    const handleCommentSubmit = async(event) => {
        event.preventDefault();
        if (comment.trim() === "") return; // Prevent empty submissions
        const getusername = await findUser();
        const finalUsername = getusername ? getusername : "Guest";
        const commentData = { username : finalUsername, content: comment }; // Replace with actual user data
        mutation.mutate(commentData); // Trigger the mutation
        setComment("");
    };

    // find the user
    const findUser = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/finduser/');
        console.log(response.data.username);
        setUsername(response.data.username); // Set the username state with the fetched username
    }
        catch (error) {
        console.error("Error fetching user data:", error);
    }
    };


    if (error) {
        return <div>{error}</div>;
    }



    // useEffect(() => {
    //     const fetchComments = async () => {
    //         if (selectedOver) {
    //             try {
    //                 const overSummaryId = overSummary[selectedOver][0].id; // Assuming you can get the ID from the first over in the group
    //                 const response = await axios.get(`http://127.0.0.1:8000/comments/${overSummaryId}/`);
    //                 setComments(response.data);
    //             } catch (error) {
    //                 console.error("Error fetching comments:", error);
    //             }
    //         }
    //     };

    //     fetchComments();
    // }, [selectedOver, overSummary]);

    // const handleCommentChange = (event) => {
    //     setComment(event.target.value);
    // };

    // const handleCommentSubmit = async (event) => {
    //     event.preventDefault();
    //     if (!comment) return;

    //     try {
    //         const overSummaryId = overSummary[selectedOver][0].id; // Get the OverSummary ID
    //         console.log(overSummaryId);
    //         await axios.post(`http://127.0.0.1:8000/comments/${overSummaryId}/`, {
    //             username: "YourUsername", // Replace with actual username or implement a user login system
    //             content: comment,
    //         });
    //         setComment(""); // Clear the input
    //         // Fetch the updated comments
    //         const response = await axios.get(`http://127.0.0.1:8000/comments/${overSummaryId}/`);
    //         setComments(response.data);
    //     } catch (error) {
    //         console.error("Error posting comment:", error);
    //     }
    // };

    
    // useEffect(() => {
    //     if (selectedOver !== null && overSummary[selectedOver]) {
    //         const overSummaryId = overSummary[selectedOver][0].id;
    
    //         // Establish WebSocket connection
    //         const ws = new WebSocket(`ws://127.0.0.1:8000/ws/comments/${overSummaryId}/`);  // Adjust port if needed

           
    //         ws.onopen = () => {
    //             console.log('WebSocket connected');
    //         };
    
    //         ws.onmessage = (event) => {
    //             const data = JSON.parse(event.data);
    //             const { comment } = data;
    
    //             // Add the new comment to the state
    //             setComments(prevComments => [...prevComments, comment]);
    //         };
    
    //         ws.onclose = () => {
    //             console.log('WebSocket disconnected');
    //         };
    
    //         setSocket(ws);
    
    //         return () => {
    //             ws.close();
    //         };
    //     }
    // }, [selectedOver, overSummary]);
    


    // const handleCommentSubmit = (e) => {
    //     e.preventDefault();
    //     if (socket && comment.trim() !== '' && selectedOver !== null && overSummary[selectedOver]) {
    //         const overSummaryId = overSummary[selectedOver][0].id; // Get the OverSummary ID
    
    //         socket.send(JSON.stringify({
    //             username: 'YourUsername',  // Replace with actual user data
    //             content: comment,
    //             overSummaryId: overSummaryId // Send the OverSummary ID
    //         }));
    //         console.log("sending data to ws");
    
    //         setComment(''); // Clear the input
    //     }
    // };
    
    





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
        <div className='mt-24 px-12'>
            <div className='mt-24 px-12'>
                <div className='card w-[480px] h-[180px] bg-white shadow-lg border-2 p-2 m-3 rounded-lg'>
                    <div className="space-y-2 p-2">
                        <div className="flex">
                            <h1 className="text-xs mr-1 font-semibold whitespace-nowrap overflow-hidden"><span className="font-semibold"></span></h1>
                            <h1 className="text-xs text-slate-700 whitespace-nowrap overflow-hidden">series_name</h1>
                        </div>
                        <div className='space-y-4 '>
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
                        <h2 className="text-xs text-slate-900 font-medium">state</h2>
                    </div>
                </div>
            </div>


            <div className='mt-24 px-12'>
                <Slider {...settings}>
                    {Object.keys(overSummary).map((overNum, index) => (
                        <div key={index} onClick={() => handleOverClick(overNum)}>
                            <h3 className={`rounded-full  ${ selectedOver == overNum ? 'bg-slate-800  py-3 text-xl'  : 'bg-slate-600 py-2 text-lg'} text-white text-center mx-8 border border-gray-500`} onClick={() => handleNumClick(overNum)}>
                                 {overNum}
                            </h3>
                        </div>
                    ))}
                </Slider>

             
              
                
                {selectedOver && overSummary[selectedOver] && (
                    <div className='mt-12 p-4 rounded-lg shadow-sm'>
                        {overSummary[selectedOver].map((over, index) => (
                            <p key={index} className='text-lg font-semibold p-4 ml-8'>{over.commentary}</p>
                        ))}

                    {/* start comment system */}
                     <div className='flex mt-12 p-4 bg-white rounded-lg shadow-md'>
                         {/* comment publish */}
                        <div className='w-1/2 p-4'>
                            {isLoading && <p>Loading comments...</p>}
                            {isError && <p>Error loading comments!</p>}
                            {comments && comments.map((comment, index) => (
                                <div key={index} className='border-b border-gray-300 py-2'>

                                    
                                        <h4 className='text-xs font-bold'>{comment.username} <span className="ml-2 text-xs text-gray-600">{new Date(comment.created_at).toLocaleString()}</span></h4>
                                        <p className='text-lg font-medium py-2  border-gray-200'>{comment.content}</p>
                                      
                                        
                                        {/* Like button */}
                                        <div className='flex items-center space-x-4 mt-1'>
                                            <button 
                                                className='items-center text-slate-500 text-sm hover:text-slate-700' 
                                                onClick={() => handleLike(comment.id)}
                                              >
                                                <i className="fa fa-thumbs-up mr-1"></i> 
                                                 {comment.likes}
                                            </button>

                                            {/* Dislike button */}
                                            <button 
                                                className=' items-center text-slate-500 text-sm hover:text-slate-700' 
                                                onClick={() => handleDislike(comment.id)}
                                            >
                                                <i className="fa fa-thumbs-down mr-1"></i> 
                                                {comment.dislikes}
                                            </button>
                                       
                                           {/* Reply button */}
                                            <button 
                                                className='text-blue-500 text-xs font-semibold hover:text-blue-800' 
                                                onClick={() => handleReply(comment.id)}
                                            >
                                                Reply
                                            </button>
                                         </div>
                                </div>
                            ))}
                        </div>

                        {/* comment box */}
                        <div className='w-1/2 p-4'>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    className='w-full h-32 p-4 border-2 border-gray-300 rounded-lg'
                                    rows="2"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                />
                                <button type="submit" className='mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg'>
                                    Submit Comment
                                </button>
                            </form>
                        </div>
                       </div>
                       {/* end comment system */}

                    </div>
                )}
                {/* end of commentary and user comment */}

            </div>
        </div>
    );
};

export default DetailsPage;