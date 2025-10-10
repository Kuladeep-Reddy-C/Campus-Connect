// frontend/src/components/EventsModule/EventDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import EventCard from './EventCard';
import EventFilter from './EventFilter';
import TrendingEvents from './TrendingEvents';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

console.log("Frontend loaded API_BASE_URL:", API_BASE_URL);
console.log("Frontend loaded API_KEY:", API_KEY);

const EventDashboard = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Clerk: isLoaded=", isLoaded, "isSignedIn=", isSignedIn, "user ID=", user?.id);
  const [filters, setFilters] = useState({ category: 'All', date: '' });
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

  // Function to fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== 'All') {
        queryParams.append('category', filters.category);
      }
      if (filters.date) {
        queryParams.append('date', filters.date);
      }

      const response = await fetch(`${API_BASE_URL}/api/events?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Function to fetch user-specific registrations (requires auth token)
  const fetchUserRegistrations = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      setRegisteredEventIds(new Set());
      return;
    }
    try {
      const token = await getToken(); // Get the default Clerk session token
      if (!token) {
        console.warn("No Clerk token found, cannot fetch user registrations.");
        setRegisteredEventIds(new Set());
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/register/user-registrations`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch user registrations');
      }
      const data = await response.json();
      const eventIds = new Set(data.data.map(reg => reg.event._id));
      setRegisteredEventIds(eventIds);
    } catch (err) {
      console.error('Error fetching user registrations:', err);
    }
  }, [isSignedIn, user?.id, getToken]);

  // Effect to fetch events when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Effect to fetch user registrations when authentication state or user changes
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserRegistrations();
    } else {
      setRegisteredEventIds(new Set());
    }
  }, [isLoaded, isSignedIn, fetchUserRegistrations, user?.id]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRegister = async (eventId) => {
    if (!isSignedIn) {
      alert('Please sign in to register for an event.');
      return;
    }
    if (!user?.id) {
      alert('User information not loaded. Please try again.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        alert('Authentication token missing. Please sign in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to register for event');
      }

      const data = await response.json();
      alert(data.message);
      setRegisteredEventIds(prev => new Set(prev).add(eventId));
      fetchUserRegistrations(); // Re-fetch registrations to confirm
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
      console.error('Error registering for event:', err);
    }
  };

  const handleCreateEventClick = () => {
    if (!isSignedIn) {
      alert('Please sign in to create an event.');
      navigate('/'); // Redirect to sign-in page
    } else {
      navigate('/create-event'); // Navigate to create event page
    }
  };


  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 text-lg">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Campus Events</h1>
        {/* "Create Event" button always present if events exist */}
        {events.length > 0 && (
          <button
            onClick={handleCreateEventClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Event
          </button>
        )}
      </div>

      <TrendingEvents />

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore All Events</h2>
        <EventFilter onFilterChange={handleFilterChange} currentFilters={filters} />
      </div>

      {events.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg shadow-inner border-2 border-dashed border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            No events found matching your criteria.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Why not be the first to organize one?
          </p>
          <button
            onClick={handleCreateEventClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Event
          </button>
          <p className="text-sm text-gray-500 mt-4">Try adjusting your filters if you expected to see events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegister}
              isRegistered={registeredEventIds.has(event._id)}
              isSignedIn={isSignedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;