import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NewsDetails = () => {
    const { id } = useParams(); // Get the news ID from the URL
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const response = await fetch('/news.json'); // Adjust the path if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const item = data.find(news => news.id === parseInt(id)); // Find the specific news item
                setNewsItem(item);
            } catch (error) {
                console.error('There was a problem fetching the news item:', error);
            }
        };

        fetchNewsItem();
    }, [id]); // Fetch when the component mounts or when id changes

    if (!newsItem) {
        return <div>Loading...</div>; // Display loading message while fetching
    }

    return (
        <div className="mx-auto mt-12 bg-white rounded-3xl lg:w-10/12 h-2/6 p-8">
            <h1 className="text-4xl font-bold">{newsItem.heading}</h1>
            <h1 className='text-lg text-gray-600 mt-2'>{newsItem.summary}</h1>
            <div className='flex gap-5 my-3'>
            <p className="text-gray-500">Published on: {new Date(newsItem.timestamp).toLocaleString()}</p>
            <li className="text-gray-500">Reported by: {newsItem.reportedBy}</li>
            </div>
            <img src={newsItem.image} alt={newsItem.heading} className="rounded-lg my-6 mx-auto lg:w-9/12" />
            <p className="text-lg my-4">{newsItem.details}</p>

        </div>
    );
};

export default NewsDetails;
