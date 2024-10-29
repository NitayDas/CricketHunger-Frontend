import { FaReplyAll } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import ReplySection from "./ReplySection";
import PropTypes from "prop-types";
import { useState ,useEffect,useContext} from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";



const ReplyList = ({ replies, setIsReplying, replyingTo, setReplyingTo, isReplying, mutation,timeAgo}) => {
    return (
      <div>
        {replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply}
            setIsReplying={setIsReplying}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            isReplying={isReplying}
            mutation={mutation}
            timeAgo={timeAgo}
          />
        ))}
      </div>
    );
  };
  
  
const ReplyItem = ({ reply, setIsReplying, replyingTo, setReplyingTo, isReplying, mutation,timeAgo}) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(reply.likes);
  const [likedByUser, setLikedByUser] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const contentPreview = isExpanded
    ? reply.content
    : reply.content.split(" ").slice(0, 20).join(" ") + (reply.content.split(" ").length > 20 ? "..." : "");

  
  useEffect(() => {
    if (reply.liked_by && Array.isArray(reply.liked_by)) {
      setLikedByUser(reply.liked_by.includes(user?.email));
    }
  }, [reply.liked_by, user?.email]);

  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/comments/like/${reply.id}/`,
      {user_email: user?.email});

      setLikes(response.data.likes);
      setLikedByUser(!likedByUser); 
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

return (
    <div className="py-2">
    <h4 className="text-xs font-bold text-gray-700">
        {reply.user.name}
        <span className="ml-2 text-xs font-medium text-gray-600">
        {timeAgo(reply.created_at)}
        </span>
    </h4>

    <div className="flex items-center justify-between gap-10 py-1">
        <p className="text-base text-gray-900">
          {reply.parent_user && reply.user && reply.parent_user.email !== reply.user.email && (
              <span className="text-xs font-bold text-gray-700 mr-2">
              @{reply.parent_user.name}
              </span>
          )}

          {contentPreview}
          {reply.content.split(" ").length > 20 && (
            <span className="text-green-700 cursor-pointer ml-1 font-semibold text-sm" onClick={ toggleExpand}>
              {isExpanded ? "See less" : "See more"}
            </span>
          )}
        </p>

        <div className="flex items-center space-x-4 mt-1">
        <button className={`flex items-center text-base ${likedByUser ? 'text-blue-500' : 'text-slate-500'} hover:text-slate-700`} onClick={handleLikeToggle}>
            <AiFillLike />
            <span className="ml-1 text-slate-500">{likes}</span>
          </button>
        <button
            className="text-blue-500 text-base font-semibold hover:text-sky-600"
            onClick={() => {
            setIsReplying(isReplying === reply.id ? false : reply.id);
            setReplyingTo(replyingTo === reply.id ? null : reply.id);
            }}
        >
            <FaReplyAll />
        </button>
        </div>
    </div>

    
    {reply.replies && reply.replies.length > 0 && (
        <ReplyList
        replies={reply.replies}
        setIsReplying={setIsReplying}
        isReplying={isReplying}
        setReplyingTo={setReplyingTo}
        replyingTo={replyingTo}
        mutation={mutation}
        timeAgo={timeAgo}
        />
    )}
    

    {replyingTo === reply.id && (
        <ReplySection
        commentId={reply.id}
        setReplyingTo={setReplyingTo}
        replyingTo={replyingTo}
        isReplying={isReplying}
        mutation={mutation}
        />
    )}

    </div>
);

};


ReplyItem.propTypes = {
    reply: PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.object.isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      likes :PropTypes.number.isRequired,
      liked_by: PropTypes.arrayOf(PropTypes.string).isRequired,
      parent_user: PropTypes.object, // Updated to allow null or undefined
      replies: PropTypes.arrayOf(PropTypes.object), // Updated to allow empty arrays or undefined
    }).isRequired,
    isReplying: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired, // Can be a number or bool
    setIsReplying: PropTypes.func.isRequired,
    replyingTo: PropTypes.oneOfType([PropTypes.number, PropTypes.null]), // Updated to allow null
    setReplyingTo: PropTypes.func.isRequired,
    mutation: PropTypes.object.isRequired, // Mutation is an object, not a function
    timeAgo: PropTypes.func.isRequired,
  };
  
  ReplyList.propTypes = {
    replies: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of reply objects
    isReplying: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
    setIsReplying: PropTypes.func.isRequired,
    replyingTo: PropTypes.oneOfType([PropTypes.number, PropTypes.null]), // Allow null
    setReplyingTo: PropTypes.func.isRequired,
    mutation: PropTypes.object.isRequired, // Mutation is an object
    timeAgo: PropTypes.func.isRequired,
  };

export default ReplyList;