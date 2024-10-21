import { useState,useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import PropTypes from "prop-types";

// Fetch replies for a specific comment
const fetchReplies = async (commentId) => {
    const response = await axios.get(`http://127.0.0.1:8000/comments/${commentId}/replies/`);
    return response.data;
  };
  
  // Post a reply to a specific comment
  const postReply = async ({ commentId, replyData }) => {
    const response = await axios.post(`http://127.0.0.1:8000/comments/${commentId}/replies/`, replyData);
    return response.data;
  };

const ReplySection = ({ comment, isReplying, setIsReplying }) => {
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();
  const { user, loading } = useContext(AuthContext);

  // Fetch replies using useQuery
  const { data: replies = [], isLoading: isLoadingReplies } = useQuery({
    queryKey: ["replies", comment.id], // Unique key for replies
    queryFn: () => fetchReplies(comment.id),
    enabled: isReplying, // Fetch replies only when the user is replying
    refetchOnWindowFocus: false,
  });

  // Mutation for posting a reply
  const mutation = useMutation({
    mutationFn: (replyData) => postReply({ commentId: comment.id, replyData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["replies", comment.id]); // Invalidate and refetch replies
    },
  });

  // Handle reply submission
  const handleReplySubmit = (event) => {
    event.preventDefault();
    if (replyContent.trim() === "") return;

    const replyData = {
        content: replyContent,
        username:  user.displayName || "Guest",
      };
  
      // Submit the reply using mutation
      mutation.mutate(replyData);

    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <>
      {/* Reply box */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-4 flex items-center gap-5 justify-center">
          <textarea
            className="w-[460px] h-12 p-2 border-2 border-gray-300 rounded-lg"
            rows="2"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply here..."
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
           Reply
          </button>
        </form>
      )}
    </>
  );
};

// Define PropTypes
ReplySection.propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired, // Make sure comment.id is required
      username: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    }).isRequired,
    isReplying: PropTypes.bool.isRequired,
    setIsReplying: PropTypes.func.isRequired,
  };

export default ReplySection;
