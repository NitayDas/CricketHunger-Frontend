import { useState, useContext, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthProvider";
import { FaReplyAll } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import "./details.css";
import ReplySection from "./ReplySection";

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
      username: user.displayName || "Guest",
      content: comment,
    };

    // Log the comment data before posting it
    console.log("Comment Data Submitted:", commentData);

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
    if (!user) {
        // Redirect to login with state to return to this page after login
        navigate('/signin', { state: { from: location } });
    }
}

  return (
    <div className="flex p-4 bg-white rounded-2xl h-auto shadow-md">
      <div className="w-1/2 p-4">
        {isLoading && <p>Loading comments...</p>}
        {isError && <p>Error loading comments!</p>}

        <p className="text-2xl font-semibold underline pb-3 mb-3">Comments</p>

        {/* Comments container with scrolling */}
        <div className="scroll" ref={scrollRef}>
          {comments.length === 0 ? (
            <p>No comments available.</p>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={index}
                comment={comment}
                isReplying={replyingTo === index} // Check if this comment is being replied to
                setIsReplying={() =>
                  setReplyingTo(replyingTo === index ? null : index)
                } // Toggle reply box
              />
            ))
          )}
        </div>
      </div>

      <div className="p-4">
        {/* disable comment box and button if the user is not logged in */}
        <form onSubmit={handleCommentSubmit} className={`${!user?.email ? "opacity-50" : ""}`}>
          <textarea
            className="w-[680px] h-32 p-4 border-2 border-gray-300 rounded-lg"
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            disabled={!user?.email} 
          />
          <button
            type="submit"
            className={`mt-4 px-4 py-2 text-white rounded-lg ${
              user?.email ? "bg-sky-600" : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!user?.email} 
          >
            Submit Comment
          </button>
        </form>

        {/* if the user is not logged in */}
        {!user?.email && (
          <p className="mt-5 text-lg font-semibold text-black">
            Please <button onClick={handleSignInSubmission} className="btn-ghost text-xl text-sky-600">Sign In</button> to comment.
          </p>
        )}
      </div>
    </div>
  );
};

// Replies List Component
const RepliesList = ({ replies }) => (
  <div className="pl-4">
    {replies.map((reply, index) => (
      <div key={index} className="border-b border-gray-200 py-1">
        <h5 className="font-bold">{reply.username}</h5>
        <p>{reply.content}</p>
      </div>
    ))}
  </div>
);

// CommentItem Component with Reply Box
const CommentItem = ({ comment, isReplying, setIsReplying }) => {
  return (
    <div className="border-b border-gray-300 py-2">
      <h4 className="text-base font-bold">
        {comment.username}
        <span className="ml-2 text-xs text-gray-600">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </h4>
      <div className="flex items-center justify-between gap-10">
        <p className="text-lg font-medium py-2 border-gray-200">
          {comment.content}
        </p>
        <div className="flex items-center space-x-4 mt-1">
          <button className="items-center text-slate-500 text-base hover:text-slate-700">
            <AiFillLike />
          </button>
          <button
            className="text-blue-500 text-base font-semibold hover:text-sky-600"
            onClick={setIsReplying}
          >
            <FaReplyAll />
          </button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <RepliesList replies={comment.replies} />
      )}

      {/* ReplySection component */}
      <ReplySection
        comment={comment}
        isReplying={isReplying}
        setIsReplying={setIsReplying}
      />
    </div>
  );
};

export default CommentsSection;
