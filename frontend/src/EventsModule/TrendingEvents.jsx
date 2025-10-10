// frontend/src/components/EventsModule/TrendingEvents.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

const TrendingEvents = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/trending/top?limit=3`, { // Fetch top 3 trending events
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch trending events');
      }
      const data = await response.json();
      setTrendingEvents(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trending events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingEvents();
  }, [fetchTrendingEvents]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-md bg-gray-200 h-24 w-64"></div>
          <div className="rounded-md bg-gray-200 h-24 w-64"></div>
          <div className="rounded-md bg-gray-200 h-24 w-64"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading trending events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error loading trending events: {error}</p>
      </div>
    );
  }

  if (trendingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No trending events available right now.</p>
      </div>
    );
  }

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-500';
      case 'Technical': return 'bg-green-500';
      case 'Sports': return 'bg-red-500';
      case 'Cultural': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🔥 Trending Events</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {trendingEvents.map((event) => (
          <Link
            to={`/events/${event._id}`}
            key={event._id}
            className={`relative w-full md:w-1/3 p-6 rounded-lg shadow-lg overflow-hidden
                       bg-gradient-to-br from-indigo-500 to-purple-600 text-white
                       transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className={`absolute -top-2 -right-2 px-3 py-1 text-xs font-bold rounded-bl-lg ${getCategoryColor(event.category)} text-white`}>
              {event.category}
            </div>
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
            <p className="text-indigo-100 text-sm">
              <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-indigo-100 text-sm">
              <span className="font-semibold">Location:</span> {event.location}
            </p>
            <div className="mt-4 flex items-center text-sm text-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.545a.75.75 0 00-.916-.134l-5 2.5a.75.75 0 00-.374 1.353l.799.4a2.5 2.5 0 011.536 2.766 2.5 2.5 0 01-2.784 1.516l-.427-.086a.75.75 0 00-.776.223l-3 3a.75.75 0 001.06 1.06l3-3a.75.75 0 00.223-.776l-.086-.427a2.5 2.5 0 011.516-2.784 2.5 2.5 0 012.766 1.536l.4.799a.75.75 0 001.353-.374l2.5-5a.75.75 0 00-.134-.916zM6 10a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">{event.trendingScore} points</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingEvents;