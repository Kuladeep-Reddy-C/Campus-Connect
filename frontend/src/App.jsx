// frontend/src/App.jsx
import React from "react";
import { useTheme } from "./Theme/ThemeProvider";
import { Link, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

// Your existing imports
import CollaborationDashboard from "./Collaborator/CollaborationDashboard";
import MindMapView from "./ResourcesModule/MindMapView";
import SubjectSelector from "./ResourcesModule/SubjectSelector";
import ProtectedRoute from "./components/ProtectedRoute"; // Your existing ProtectedRoute
import { BranchSelector } from "./ResourcesModule/BranchSelector";
import Navbar from "./components/Navbar";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW EVENTS MODULE IMPORTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import EventDashboard from "./EventsModule/EventDashboard";
import EventDetails from "./EventsModule/EventDetails";
import CreateEventPage from "./EventsModule/CreateEventPage";
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END NEW IMPORTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


function About() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { isSignedIn, isLoaded, user } = useUser();
  const API_KEY = import.meta.env.VITE_API_KEY; // Import your API key for backend calls

  if (!isLoaded) return <div>Loading user data...</div>; // More specific loading message

  const handleWebHandler = async () => {
    try {
      if (!user) {
        console.warn('User object not available for web handler registration.');
        return;
      }

      const userData = {
        id: user.id, // Clerk's user ID
        fullName: user.fullName || 'N/A', // Fallback for fullName
        emailAddress: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl
      };

      const response = await fetch(`${url}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY, // Include your custom API key
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('User saved to MongoDB:', data);
      alert('You have been added as a website handler!');
    } catch (error) {
      console.error('Error saving user:', error);
      alert(`Failed to add user as handler: ${error.message}`);
    }
  };

  return (
    <div className="bg-background text-text min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-primary text-4xl font-bold mb-6">About Campus Connect</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Campus Connect is your one-stop platform for managing resources, collaborating on projects, and staying updated on all campus events and club activities. We aim to foster a vibrant and connected student community.
      </p>
      {isSignedIn && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            If you are a faculty member or administrator, you can register yourself as a website handler to manage content.
          </p>
          <button
            onClick={handleWebHandler}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          >
            Click me to add yourself as a website handler
          </button>
        </div>
      )}
      {!isSignedIn && (
        <p className="text-gray-500 mt-4">Sign in to unlock more features and manage content.</p>
      )}
    </div>
  );
}

function Clubs() {
  return (
    <div className="bg-background text-text min-h-screen flex items-center justify-center">
      <h1 className="text-primary text-4xl font-bold">Clubs Page</h1>
      <p className="text-lg text-gray-600 mt-4">Coming Soon: Detailed club listings and management!</p>
    </div>
  );
}


export default function App() {
  const { mode, setMode } = useTheme(); // Assuming useTheme correctly provides mode and setMode

  return (
    <div className="bg-background text-text min-h-screen flex flex-col">
      {/* Navbar will apply across all routes */}
      <Navbar />

      {/* Main content area */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]"> {/* Adjust height based on navbar height */}
              <h1 className="text-primary text-5xl font-extrabold">Welcome to Campus Connect!</h1>
            </div>
          } />
          <Route path="/about" element={<About />} />

          {/* Resources Module Routes */}
          <Route path="/resources" element={<BranchSelector />} />
          <Route path="/resources/:subjectId" element={<MindMapView />} />
          {/* Protected route example for SubjectSelector */}
          <Route path="/resources/subject/:departmentId" element={<ProtectedRoute><SubjectSelector /></ProtectedRoute>} />

          {/* Collaboration Module Routes */}
          <Route path="/collaborate" element={<CollaborationDashboard />} />

          {/* Clubs Module Route */}
          <Route path="/clubs" element={<Clubs />} />

          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NEW EVENTS MODULE ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
          <Route path="/events" element={<EventDashboard />} />
          <Route path="/events/:id" element={<EventDetails />} /> {/* Route for individual event details */}
          <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} /> {/* <--- ADD THIS NEW ROUTE */}
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END NEW ROUTES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}

          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
              <h1 className="text-primary text-4xl font-bold">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}