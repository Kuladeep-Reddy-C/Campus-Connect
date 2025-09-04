import { useState } from "react";
import { BranchSelector } from "./BranchSelector";
import { MindMapView } from "./MindMapView";

const DashBoard = () => {
    const [currentView, setCurrentView] = useState("selector");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const handleBranchSelect = (branch, subject) => {
        setSelectedBranch(branch);
        setSelectedSubject(subject);
        setCurrentView("mindmap");
    };

    const handleBackToSelector = () => {
        setCurrentView("selector");
        setSelectedBranch("");
        setSelectedSubject("");
    };

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300">
            {currentView === "mindmap" ? (
                <MindMapView
                    branch={selectedBranch}
                    subject={selectedSubject}
                    onBack={handleBackToSelector}
                />
            ) : (
                <BranchSelector onBranchSelect={handleBranchSelect} />
            )}
        </div>
    );
};

export default DashBoard;
