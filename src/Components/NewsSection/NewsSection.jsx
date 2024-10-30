import React, { useEffect, useState } from 'react';
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
            <h2 className="text-xl font-semibold px-2 pt-3 lg:text-3xl lg:px-12 lg:pt-8">Recent News</h2>
            {newsData.map((news) => {
                const date = new Date(news.timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                return (
                    <div key={news.id} className="flex flex-col md:flex-row rounded-lg m-2 p-4 md:items-start lg:gap-6">
                        <img src={news.image} alt={news.heading} className="rounded-lg lg:h-48 lg:w-72 md:h-32 md:w-48" />
                        <div className="mt-2 md:mt-0 md:ml-4">
                            <Link to={`/news/${news.id}`}>
                                <h2 className="text-2xl font-bold my-1 lg:my-2 md:text-3xl lg:text-4xl">{news.heading}</h2>
                            </Link>
                            <p className="text-gray-700 text-md lg:text-lg">{news.summary}</p>
                            <div className="flex flex-col  gap-1 mt-2 md:flex-row md:gap-2 lg:flex-row lg:gap-3">
                                <p className="text-gray-500 text-sm">{formattedDate}</p>
                                <li className="text-gray-500 text-sm">{news.reportedBy}</li>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NewsSection;
