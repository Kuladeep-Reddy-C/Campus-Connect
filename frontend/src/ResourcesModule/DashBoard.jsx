import { BranchSelector } from "./BranchSelector";

const DashBoard = () => {
    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300">
            <BranchSelector />
        </div>
    );
};

export default DashBoard;