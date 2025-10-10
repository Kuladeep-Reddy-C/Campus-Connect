// frontend/src/components/EventsModule/EventDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationQrCode, setRegistrationQrCode] = useState('');

  const fetchEventDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch event details');
      }
      const data = await response.json();
      setEvent(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event details:', err);
      if (err.message.includes('not found')) {
        navigate('/events');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const checkRegistrationStatus = useCallback(async () => {
    if (!isSignedIn || !user?.id || !event?._id) {
      setIsRegistered(false);
      setRegistrationQrCode('');
      return;
    }
    try {
      // Assuming this endpoint sends the Authorization header correctly
      const token = await user.getToken(); // Get the current session token
      const response = await fetch(`${API_BASE_URL}/api/register/user-registrations`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${token}`, // Include the Authorization header
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch user registrations');
      }
      const data = await response.json();
      const userRegistration = data.data.find(reg => reg.event._id === event._id);

      if (userRegistration) {
        setIsRegistered(true);
        setRegistrationQrCode(userRegistration.qrCodeData);
      } else {
        setIsRegistered(false);
        setRegistrationQrCode('');
      }
    } catch (err) {
      console.error('Error checking registration status:', err);
      // Handle cases like token expiry by logging out or prompting re-login
      if (err.message.includes('401')) {
        alert('Your session has expired. Please sign in again.');
        // Optionally redirect to sign-in page: navigate('/sign-in');
      }
    }
  }, [isSignedIn, user?.id, event?._id, user]); // Add user to dependencies

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  useEffect(() => {
    if (event && isLoaded) {
      checkRegistrationStatus();
    }
  }, [event, isLoaded, checkRegistrationStatus]);

  const handleRegister = async () => {
    if (!isSignedIn) {
      alert('Please sign in to register for an event.');
      return;
    }
    if (!user?.id) {
      alert('User information not loaded. Please try again.');
      return;
    }
    if (!event?._id) {
      alert('Event details not loaded. Cannot register.');
      return;
    }

    try {
      const token = await user.getToken(); // Get the current session token
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${token}`, // Include the Authorization header
        },
        body: JSON.stringify({ eventId: event._id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to register for event');
      }

      const data = await response.json();
      alert(data.message);
      setIsRegistered(true);
      setRegistrationQrCode(data.data.qrCodeData);
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
      console.error('Error registering for event:', err);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 text-lg">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center p-8 text-gray-600 text-lg">
        <p>Event not found or invalid ID.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Technical': return 'bg-green-100 text-green-800';
      case 'Sports': return 'bg-red-100 text-red-800';
      case 'Cultural': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl"> {/* Increased max-w for image */}
      <div className="bg-white rounded-lg shadow-xl">
        {/* --- NEW: Image Display at the top of Event Details --- */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-lg">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L15 15m0 0l4.586-4.586a2 2 0 012.828 0L20 14m-2-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {/* <p className="text-white text-xl font-bold">Event Visual</p> */}
            </div>
          )}
        </div>
        {/* --- END NEW: Image Display --- */}

        <div className="p-8"> {/* Adjusted padding after image */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{event.title}</h1>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getCategoryBadge(event.category)}`}>
              {event.category}
            </span>
          </div>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Date & Time:</span> {formatDate(event.date)}
            </div>
            <div className="flex items-center text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Location:</span> {event.location}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleRegister}
              disabled={isRegistered || !isSignedIn}
              className={`px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300
                ${isRegistered
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : isSignedIn
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                    : 'bg-indigo-400 text-white cursor-not-allowed'
                }`}
            >
              {isRegistered ? 'Registered' : (isSignedIn ? 'Register for Event' : 'Sign In to Register')}
            </button>
          </div>

          {isRegistered && registrationQrCode && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">Your Registration QR Code</h3>
              <p className="text-indigo-700 mb-4">Show this QR code at the event check-in.</p>
              <div className="flex justify-center">
                <img src={registrationQrCode} alt="Registration QR Code" className="w-64 h-64 border-4 border-white shadow-lg" />
              </div>
              <p className="text-sm text-indigo-600 mt-4">This QR code is unique to your registration for this event.</p>
            </div>
          )}

          {!isRegistered && event.qrCode && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Event Information QR Code</h3>
              <p className="text-gray-600 mb-4">Scan this for general event details (not for registration check-in).</p>
              <div className="flex justify-center">
                <img src={event.qrCode} alt="Event QR Code" className="w-48 h-48 border-2 border-white shadow-md" />
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/events')}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              ← Back to All Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;