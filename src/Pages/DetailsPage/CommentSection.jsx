import { useState, useContext, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthProvider";
import { FaReplyAll } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import "./details.css";
import PropTypes from "prop-types";
import ReplySection from "./ReplySection";
import ReplyList from "./ReplyList";



// Fetch comments for a specific summary
const fetchComments = async (overSummaryId) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/comments/${overSummaryId}/`
  );
  return response.data;
};

// Post a new comment
const postComment = async ({ overSummaryId, commentData }) => {
  const response = await axios.post(
    `http://127.0.0.1:8000/comments/${overSummaryId}/`,
    commentData
  );
  return response.data;
};

const CommentsSection = ({ overSummaryId }) => {
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Access user and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Fetch comments using react-query
  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", overSummaryId],
    queryFn: () => fetchComments(overSummaryId),
    enabled: !!overSummaryId,
    refetchOnWindowFocus: false,
  });

  // Mutation for posting a comment
  const mutation = useMutation({
    mutationFn: (commentData) => postComment({ overSummaryId, commentData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", overSummaryId]);
    },
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
    const commentData = {
        user: {
          name: user?.displayName,
          email: user?.email,
      },
      content: comment,
      parent : null,
    };

    

    // Post the comment
    mutation.mutate(commentData);

    setComment(""); // Clear the comment input
  };

  // Scroll to the bottom of the comments when a new comment is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  if (loading) {
    return <progress className="progress text-6xl w-56"></progress>;
  }

  const handleSignInSubmission = () => {
    if (!user?.email) {
        // Redirect to login with state to return to this page after login
        navigate('/signin', { state: { from: location } });
    }
}

return (
  <div className="w-full flex flex-col p-4 bg-white rounded-2xl h-auto shadow-md md:flex-row md:gap-8 lg:flex-row">
    <div className="lg:w-1/2 p-4">
      {isLoading && <p>Loading comments...</p>}
      {isError && <p>Error loading comments!</p>}

      <p className="text-xl font-semibold underline pb-3 mb-3 md:text-2xl">Comments</p>

      {/* Comments container with scrolling */}
      <div
            className={`${
                comments.length === 0 ? "min-h-[80px]" : "min-h-[300px] max-h-[500px] overflow-y-auto"
            }`}
            ref={scrollRef}
        >
            {comments.length === 0 ? (
                <p>No comments available.</p>
            )  : (
          comments.map((comment, index) => (
            <CommentItem
              key={index}
              comment={comment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              isReplying={replyingTo === index} 
              setIsReplying={() =>
                setReplyingTo(replyingTo === index ? null : index)
              } 
              mutation={mutation}
              user = {user}
            />
          ))
        )}
      </div>
    </div>

    <div className="p-4 lg:w-1/2">
    <form onSubmit={handleCommentSubmit} className={`${!user?.email ? "opacity-30" : ""}`}>
          <textarea
            className={`w-full h-32 p-4 border-2 border-gray-300 rounded-lg ${
              user?.email ? "bg-white" : "bg-gray-500 cursor-not-allowed"
            }`}
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            disabled={!user?.email}
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg"
            disabled={!user?.email}
          >
            Submit Comment
          </button>
        </form>
        {!user?.email && (
          <p className="mt-5 text-lg font-semibold text-black">
            Please <button onClick={handleSignInSubmission} className="btn-ghost text-xl text-sky-600">Sign In</button> to comment.
          </p>
        )}
      </div>
    </div>
  );
};



function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y" ;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mon"  ;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d"   ;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h"  ;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m"  ;

  return Math.floor(seconds) + "s"  ;
}

const countReplies = (comment) => {
  if (!comment.replies || comment.replies.length === 0) {
    return 0;
  }
  return comment.replies.length + comment.replies.reduce((acc, reply) => acc + countReplies(reply), 0);
};

// CommentItem Component with Reply Box
const CommentItem = ({ comment, isReplying, replyingTo, setReplyingTo, mutation, setIsReplying,user}) => {

  const [likes, setLikes] = useState(comment.likes);
  const [likedByUser, setLikedByUser] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleReplies = () => setIsRepliesVisible(!isRepliesVisible);

  const contentPreview = isExpanded
    ? comment.content
    : comment.content.split(" ").slice(0, 20).join(" ") + (comment.content.split(" ").length > 20 ? "..." : "");

  const repliesCount = countReplies(comment);

  
  useEffect(() => {
    if (comment.liked_by && Array.isArray(comment.liked_by)) {
      setLikedByUser(comment.liked_by.includes(user?.email));
    }
  }, [comment.liked_by, user?.email]);


  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/comments/like/${comment.id}/`,
      {user_email: user?.email});

      setLikes(response.data.likes);
      setLikedByUser(!likedByUser); 
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };



  return (
    <div className="border-b border-gray-300 px-2">
      <h4 className="text-xs font-bold text-gray-700">
         {comment.user.name}
        <span className="ml-2 text-xs font-medium text-gray-600">
          {timeAgo(comment.created_at)}
        </span>
      </h4>
      <div className="flex items-center justify-between gap-10">
      <p
          className="flex-1 text-base text-gray-900 font-medium py-1 border-gray-200 cursor-pointer"
         >
          {contentPreview}
          {comment.content.split(" ").length > 20 && (
            <span className="text-green-700 cursor-pointer ml-1 font-semibold text-sm" onClick={ toggleExpand}>
              {isExpanded ? "See less" : "See more"}
            </span>
          )}
        </p>
        <div className="flex items-center space-x-4 mt-1">

          <button className={`flex items-center text-base ${likedByUser ? 'text-blue-500' : 'text-slate-500'} hover:text-slate-700`} 
          onClick={handleLikeToggle}
          disabled={!user?.email}
          >
            <AiFillLike />
            <span className="ml-1 text-slate-500">{likes}</span>
          </button>

          <button
            className="text-blue-500 text-base font-semibold hover:text-sky-600"
            onClick={setIsReplying}
            disabled={!user?.email}
          >
            <FaReplyAll />
          </button>
        </div>
      </div>
      
      <div className="pl-6">
      {comment.replies && comment.replies.length > 0 && (
          <>
            {isRepliesVisible && (
              <ReplyList
                replies={comment.replies}
                setIsReplying={setIsReplying}
                isReplying={isReplying}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                mutation={mutation}
                timeAgo={timeAgo}
              />
            )}
            <button
              className="text-sm text-blue-500 hover:text-blue-600 -ml-6"
              onClick={toggleReplies}
            >
              {isRepliesVisible ? "Hide replies" : `View ${repliesCount} more replies`}
            </button>
          </>
        )}
      {/* {comment.replies && comment.replies.length > 0 && (
        <ReplyList
          replies={comment.replies}
          setIsReplying={setIsReplying}
          isReplying={isReplying}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          mutation={mutation}
          timeAgo={timeAgo}
        />
      )} */}
      </div>

     
       {isReplying && (
        <ReplySection
          commentId={comment.id}
          setReplyingTo={setReplyingTo}
          replyingTo={replyingTo}
          isReplying={isReplying}
          mutation={mutation}
        />
       )}

    </div>
    
  );
};





CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    likes :PropTypes.number.isRequired,
    liked_by: PropTypes.arrayOf(PropTypes.string).isRequired,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
        }),
        content: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  
  isReplying: PropTypes.bool.isRequired,
  setIsReplying: PropTypes.func.isRequired,
  replyingTo: PropTypes.number,
  setReplyingTo: PropTypes.func.isRequired,
  mutation: PropTypes.func.isRequired,
  user:PropTypes.object.isRequired,
};
  

CommentsSection.propTypes = {
  overSummaryId :PropTypes.number.isRequired,
};

  
export default CommentsSection;
