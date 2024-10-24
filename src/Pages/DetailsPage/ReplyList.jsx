import { FaReplyAll } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import ReplySection from "./ReplySection";
import PropTypes from "prop-types";

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
        {reply.content}
        </p>

        <div className="flex items-center space-x-4 mt-1">
        <button className="items-center text-slate-500 text-base hover:text-slate-700">
            <AiFillLike />
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