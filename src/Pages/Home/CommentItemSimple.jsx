import { AiFillLike } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { Link,useNavigate } from 'react-router-dom';


function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y";
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mon";
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m";
  
    return Math.floor(seconds) + "s";
  }



const CommentItemSimple = ({ comment }) => {

    const navigate = useNavigate();

    const handleRedirect = () => {
        const matchId = comment.match_id; 
        const over_num = comment.over_num; 

        if (matchId && over_num) {
            navigate(`/details/${matchId}?over_num=${over_num}`);
        } else {
            console.error('Required IDs not found for navigation');
        }
    };

    return (
      <div className=" border-b border-gray-300 px-4 py-2">
        <h4 className="text-sm font-semibold text-gray-700">
          {comment.user.name}
          <span className="ml-2 text-xs text-gray-600">
            {timeAgo(comment.created_at)}
          </span>
        </h4>
        <div className="flex items-center justify-between gap-10">
           <p
              className="flex-1 text-base text-gray-900 font-medium py-1 border-gray-200 cursor-pointer hover:text-blue-600"
              onClick={handleRedirect}
            >
              {comment.content}
            </p>
            <div className="items-center space-x-4 mt-2">
            <button className="flex items-center text-base text-slate-500 hover:text-blue-500">
                <AiFillLike />
                <span className="ml-1">{comment.likes}</span>
            </button>
            </div>
        </div>
      </div>
    );
  };


  CommentItemSimple.propTypes = {
    comment: PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      match_id: PropTypes.string, 
      over_num: PropTypes.number, 
    }).isRequired,
};


export default CommentItemSimple;