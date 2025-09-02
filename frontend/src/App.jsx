import React from "react";
import { useTheme } from "./Theme/ThemeProvider";
import { Link, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="bg-background text-text min-h-screen flex items-center justify-center">
      <h1 className="text-primary text-4xl font-bold">Home Page</h1>
    </div>
  );
}

function About() {
  return (
    <div className="bg-background text-text min-h-screen flex items-center justify-center">
      <h1 className="text-primary text-4xl font-bold">About Page</h1>
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
        </div>
      </nav>

      {/* Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      <footer className="bg-card border-t border-muted p-4 text-center">
        Current Mode: <strong>{mode}</strong>
      </footer>
    </div>
  );
}
