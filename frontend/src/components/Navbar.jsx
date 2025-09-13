// Navbar.jsx
import React, { useState } from "react";
import { useTheme } from "../Theme/ThemeProvider";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useUser, useClerk } from '@clerk/clerk-react';

const Navbar = () => {
    const { setMode } = useTheme();
    const { user } = useUser();
    const clerk = useClerk();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-card border-b border-muted p-4 flex justify-between items-center relative z-40">
            <div className="flex items-center gap-4">
                
                <div className="text-primary font-bold">Company Logo</div> 

                
                <Link to="/" className="text-primary font-bold hover:text-primary/80 transition-colors">Home</Link>
                <Link to="/about" className="text-primary font-bold hover:text-primary/80 transition-colors">About</Link>

                
                <Link to="/resources" className="text-primary font-bold hover:text-primary/80 transition-colors">Resources</Link>
                <Link to="/collaborate" className="text-primary font-bold hover:text-primary/80 transition-colors">Collaboration</Link>
                <Link to="/clubs" className="text-primary font-bold hover:text-primary/80 transition-colors">Clubs</Link>
                <Link to="/events" className="text-primary font-bold hover:text-primary/80 transition-colors">Events</Link>
            </div>

            <div className="flex items-center gap-2">
                <SignedOut>
                    <SignInButton mode="modal" appearance={{
                        variables: {
                            colorPrimary: "#BF0C4F",
                        },
                        elements: {
                            headerTitle: "text-primary text-4xl font-bold",
                        }
                    }}>
                        <button className="px-4 py-2 border border-muted rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div
                        onClick={() => setIsMenuOpen(true)}
                        className="cursor-pointer hover:ring-2 hover:ring-primary/20 rounded-full transition-all duration-200"
                    >
                        <img src={user?.imageUrl} alt="User Profile" className="w-8 h-8 rounded-full" />
                    </div>
                </SignedIn>
            </div>

            {/* Backdrop Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Right Sidebar Menu (Drawer) */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-muted shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-primary">Account Settings</h2>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors group"
                        >
                            <svg
                                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info Section */}
                    <SignedIn>
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg mb-6">
                            <img src={user?.imageUrl} alt="User Profile" className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-semibold text-primary">{user?.fullName || user?.firstName}</p>
                                <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                    </SignedIn>

                    {/* Theme Selection - Compact Toggle */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Theme
                        </h3>
                        <div className="flex items-center bg-muted/50 rounded-lg p-1">
                            <button
                                onClick={() => { setMode("light"); setIsMenuOpen(false); }}
                                className="flex-1 px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted flex items-center justify-center gap-2"
                            >
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                Light
                            </button>
                            <button
                                onClick={() => { setMode("dark"); setIsMenuOpen(false); }}
                                className="flex-1 px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted flex items-center justify-center gap-2"
                            >
                                <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                                Dark
                            </button>
                            <button
                                onClick={() => { setMode("system"); setIsMenuOpen(false); }}
                                className="flex-1 px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted flex items-center justify-center gap-2"
                            >
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-gray-800"></div>
                                Auto
                            </button>
                        </div>
                    </div>

                    {/* Sign Out Section */}
                    <div className="mt-auto pt-6 border-t border-muted">
                        <button
                            onClick={() => { clerk.signOut(); setIsMenuOpen(false); }}
                            className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;