import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewsSection = () => {
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/news/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNewsData(data);
            } catch (error) {
                console.error('There was a problem fetching the news data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className=" mx-auto  lg:w-11/12 mt-12 bg-white rounded-2xl p-6 ">
        <h2 className="text-2xl font-semibold text-black mb-4">Recent News</h2>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {newsData.map((news) => {
                const date = new Date(news.pub_time);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
                return (
                    <div key={news.id} className="flex items-start gap-4 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                        {/* Optional Image */}
                        {/* <img src={news.image} alt="thumb" className="w-20 h-20 object-cover rounded-md" /> */}
                        
                        <div className="flex-1">
                            <Link to={`/news/${news.story_id}`}>
                                <h2 className="text-md font-bold text-black mb-1 line-clamp-2">{news.headline}</h2>
                                <p className="text-gray-700 text-sm line-clamp-2">{news.intro}</p>
                            </Link>
                            <div className="flex text-xs text-gray-500 justify-between mt-1">
                                <span>{formattedDate}</span>
                                <span>{news.source}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    
    
    );
};

export default NewsSection;
