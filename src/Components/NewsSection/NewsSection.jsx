import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewsSection = () => {
    const [newsData, setNewsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/news.json');
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
        <div className="mx-auto mt-12 bg-white rounded-2xl lg:w-10/12">
            <h2 className='text-2xl font-semibold lg:px-12 lg:pt-8 text-black'>Recent News</h2>
            {newsData.map((news) => {
                const date = new Date(news.timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                return (
                    <div key={news.id} className="flex">
                        <div className="news-item  flex rounded-lg m-2 lg:gap-14 lg:justify-between lg:px-8 lg:py-2">
                            <img src={news.image} alt={news.heading} className="rounded-lg lg:h-48 lg:w-72" />
                            <div>
                                <Link to={`/news/${news.id}`}>
                                <h2 className="text-xl font-bold my-2 text-black">{news.heading}</h2>
                                <p className="text-gray-700 text-lg">{news.summary}</p>
                                </Link>
                                <div className='flex gap-4 '>
                                    <p className="text-gray-500 text-sm my-1">{formattedDate}</p>
                                    <li className="text-gray-500 text-sm my-1">{news.reportedBy}</li>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NewsSection;
