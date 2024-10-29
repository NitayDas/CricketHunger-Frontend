import { useState,useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import PropTypes from "prop-types";



const ReplySection = ({ commentId,replyingTo,setReplyingTo ,isReplying,mutation}) => {
  const [replyContent, setReplyContent] = useState("");
  const { user } = useContext(AuthContext);


  const handleReplySubmit = (event) => {
    event.preventDefault();
    if (replyContent.trim() === "") return;

    console.log(commentId)
    console.log(replyingTo)
    console.log(isReplying)

    const commentData = {
      user: {
          name: user.displayName,
          email: user.email,
      },
      content: replyContent,
      parent:commentId,
    };

    mutation.mutate(commentData);
    setReplyContent("");
    setReplyingTo(null);  // Close the reply box after submitting
  };

  return (
        <>
          {/* Reply box */}
          {(replyingTo || isReplying) && (
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
  overSummaryId :PropTypes.number.isRequired,
  commentId :PropTypes.number.isRequired,
  setReplyingTo : PropTypes.number.isRequired,
  replyingTo: PropTypes.number.isRequired,
  mutation: PropTypes.func.isRequired,
};

export default ReplySection;