// frontend/src/components/EventsModule/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, isRegistered, isSignedIn }) => {
  const { _id, title, category, date, location, imageUrl } = event; // Destructure imageUrl

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Technical': return 'bg-green-100 text-green-800';
      case 'Sports': return 'bg-red-100 text-red-800';
      case 'Cultural': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 flex flex-col overflow-hidden">
      {/* --- NEW: Image Display Area --- */}
      <div className="relative h-48 w-full"> {/* Fixed height for consistent card size */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center rounded-t-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L15 15m0 0l4.586-4.586a2 2 0 012.828 0L20 14m-2-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {/* <p className="text-white text-lg font-semibold">No Image</p> */}
          </div>
        )}
      </div>
      {/* --- END NEW: Image Display Area --- */}

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
            <Link to={`/events/${_id}`} className="hover:text-indigo-600 transition-colors duration-200">
              {title}
            </Link>
          </h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(date)}
        </p>
        <p className="text-gray-600 text-sm flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>
      </div>
      <div className="p-6 border-t border-gray-100 flex justify-between items-center">
        <Link
          to={`/events/${_id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
        >
          View Details
        </Link>
        <button
          onClick={() => onRegister(_id)}
          disabled={isRegistered || !isSignedIn}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
            ${isRegistered
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : isSignedIn
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                : 'bg-indigo-400 text-white cursor-not-allowed'
            }`}
        >
          {isRegistered ? 'Registered' : (isSignedIn ? 'Register' : 'Sign In to Register')}
        </button>
      </div>
    </div>
  );
};

export default EventCard;