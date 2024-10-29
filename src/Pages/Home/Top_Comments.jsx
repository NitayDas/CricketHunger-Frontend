import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentItemSimple from './CommentItemSimple';



const Top_Comments = () => {
    const [comments, setComments] = useState([]);

    useEffect(()=>{
       const fetchTopComments = async()=>{
          try{
            const response = await axios.get('http://127.0.0.1:8000/top-comments/');
            setComments(response.data);
          }catch (error) {
            console.error("Error fetching top comments:", error);
          }
       }

       fetchTopComments();
    },[]);

    return (
       <div className='w-full'>
        <h3 className="text-2xl font-semibold text-center text-white shadow-lg border bg-red-400 rounded-md">Top Comments</h3>
        <div className="h-96 overflow-y-scroll border bg-gray-100 rounded-md p-4">
            {comments.slice(0, 10).map((comment) => (
            <CommentItemSimple key={comment.id} comment={comment} />
            ))}
        </div>
      </div>
    );
};


export default Top_Comments;