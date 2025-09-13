// App.jsx
import React from "react";
import { useTheme } from "./Theme/ThemeProvider";
import { Link, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

import CollaborationDashboard from "./Collaborator/CollaborationDashboard";

import MindMapView from "./ResourcesModule/MindMapView";
import SubjectSelector from "./ResourcesModule/SubjectSelector";
import ProtectedRoute from "./components/ProtectedRoute";
import { BranchSelector } from "./ResourcesModule/BranchSelector";
import Navbar from "./components/NavBar";

function About() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const handleWebHandler = async () => {
    try {
      const userData = {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl
      };

      const response = await fetch(`${url}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User saved to MongoDB:', data);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="bg-background text-text min-h-screen flex items-center justify-center">
      <h1 className="text-primary text-4xl font-bold">About Page</h1>
      {isSignedIn && <button onClick={handleWebHandler}>Click me to add yourself as one of the website handlers</button>}
    </div>
  );
}

function Clubs() {
  return <h1>Clubs Page</h1>;
}

function Events() {
  return <h1>Events Page</h1>;
}

export default function App() {
  const { mode, setMode } = useTheme();

  return (
    <div className="bg-background text-text min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<BranchSelector />} />
          <Route path="/resources/:subjectId" element={<MindMapView />} />
          <Route path="/resources/subject/:departmentId" element={<ProtectedRoute><SubjectSelector /></ProtectedRoute>} />
          <Route path="/collaborate" element={<CollaborationDashboard />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </div>
  );
}