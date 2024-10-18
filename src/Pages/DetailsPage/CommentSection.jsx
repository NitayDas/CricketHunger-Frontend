import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Provider/AuthProvider';
import { FaReplyAll } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import './details.css';

// Fetch comments for a specific summary
const fetchComments = async (overSummaryId) => {
  const response = await axios.get(`http://127.0.0.1:8000/comments/${overSummaryId}/`);
  return response.data;
};

// Post a new comment
const postComment = async ({ overSummaryId, commentData }) => {
  const response = await axios.post(`http://127.0.0.1:8000/comments/${overSummaryId}/`, commentData);
  return response.data;
};

const CommentsSection = ({ overSummaryId }) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // Access user and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Fetch comments using react-query
  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: ['comments', overSummaryId],
    queryFn: () => fetchComments(overSummaryId),
    enabled: !!overSummaryId,
    refetchOnWindowFocus: false,
  });

  // Mutation for posting a comment
  const mutation = useMutation({
    mutationFn: (commentData) => postComment({ overSummaryId, commentData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', overSummaryId]);
    }
  });

  // Handle comment submission
const handleCommentSubmit = (event) => {
  event.preventDefault();
  if (comment.trim() === "") return; // Prevent empty comments

  // Check if user is authenticated
  if (!user?.email) {
    // Redirect to sign-in page with current pathname
    navigate("/signin", { state: { from: location.pathname } });
    return;
  }

  // Prepare comment data
  const commentData = { username: user.displayName || "Guest", content: comment };
  
  // Log the comment data before posting it
  console.log("Comment Data Submitted:", commentData);

  // Post the comment
  mutation.mutate(commentData);
  
  setComment(""); // Clear the comment input
};

  if (loading) {
    return <progress className="progress text-6xl w-56"></progress>;
  }

  return (
    <div className='flex p-4 bg-white rounded-2xl shadow-md'>
      <div className='w-1/2 p-4'>
        {isLoading && <p>Loading comments...</p>}
        {isError && <p>Error loading comments!</p>}

        <p className='text-2xl font-semibold underline pb-3 mb-3'>Comments</p>

        {/* Comments container with scrolling */}
        <div className="scroll">
          {comments.length === 0 ? ( // Check if there are no comments
            <p>No comments available.</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className='border-b border-gray-300 py-2'>
                <h4 className='text-base font-bold'>
                  {comment.username} 
                  <span className="ml-2 text-xs text-gray-600">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </h4>
                <div className='flex items-center justify-between gap-10'>
                  <p className='text-lg font-medium py-2 border-gray-200'>{comment.content}</p>
                  <div className='flex items-center space-x-4 mt-1'>
                    <button className='items-center text-slate-500 text-base hover:text-slate-700'>
                      <AiFillLike />
                    </button>
                    <button className='text-blue-500 text-base font-semibold hover:text-blue-800'>
                      <FaReplyAll />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
  );
};

export default CommentsSection;
