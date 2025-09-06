import React from "react";
import { useTheme } from "./Theme/ThemeProvider";
import { Link, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';


import MindMapView from "./ResourcesModule/MindMapView";
import SubjectSelector from "./ResourcesModule/SubjectSelector";
import ProtectedRoute from "./components/ProtectedRoute";
import { BranchSelector } from "./ResourcesModule/BranchSelector";


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

export default function App() {
  const { mode, setMode } = useTheme();

  return (
    <div className="bg-background text-text min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-card border-b border-muted p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="text-primary font-bold">Home</Link>
          <Link to="/about" className="text-primary font-bold">About</Link>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("light")} className="px-3 py-1 border border-muted rounded">
            Light
          </button>
          <button onClick={() => setMode("dark")} className="px-3 py-1 border border-muted rounded">
            Dark
          </button>
          <button onClick={() => setMode("system")} className="px-3 py-1 border border-muted rounded">
            System
          </button>
          <SignedOut>
            <SignInButton mode="modal" appearance={{
              variables: {
                colorPrimary: "#BF0C4F",
              },
              elements: {
                headerTitle: "text-primary text-4xl font-bold",
              }
            }}>
              <button className="px-3 py-1 border border-muted rounded cursor-pointer">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<BranchSelector />} />
          <Route path="/resources/:subjectId" element={<MindMapView />} />
          <Route path="/resources/subject/:departmentId" element={<ProtectedRoute><SubjectSelector /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}
