import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { BookOpen, Plus } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { AddDepartmentModal } from "./components/AddDepartmentModal";

export function BranchSelector() {
    const { isLoaded, user } = useUser();
    const url = import.meta.env.VITE_BACKEND_URL;
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWebHandler, setIsWebHandler] = useState(false);
    const navigate = useNavigate();

    const predefinedImages = [
        "/dep1.jpg", 
        "/dep2.jpg",
    ];

    useEffect(() => {
        let isMounted = true;

        const fetchBranch = async () => {
            try {
                const response = await fetch(`${url}/res/dep`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched branches:", data);
                if (isMounted) {
                    const enhancedData = data.map((dept, index) => ({
                        ...dept,
                        id: dept._id,
                        name: dept.departmentName,
                        deptImage: predefinedImages[index % predefinedImages.length],
                    }));
                    setBranches(enhancedData);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${url}/api/users/${user.id}`);
                if (response.ok) {
                    setIsWebHandler(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (isLoaded) {
            fetchBranch();
            fetchUserData();
        }

        return () => {
            isMounted = false;
        };
    }, [isLoaded, url, user?.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelectorAll('[data-loaded="false"]').forEach((el) => {
                el.setAttribute('data-loaded', 'true');
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [branches]);

    const handleBranchClick = (branchId) => {
        console.log("Clicked branch ID:", branchId);
        navigate(`/resources/subject/${branchId}`);
    };

    const handleNewDep = () => {
        setIsModalOpen(true);
    };

    const handleAddDepartment = async (departmentName) => {
        try {
            const response = await fetch(`${url}/res/dep`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ departmentName, subjects: [] }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newDept = await response.json();
            setBranches((prev) => [
                ...prev,
                {
                    ...newDept,
                    id: newDept._id,
                    name: newDept.departmentName,
                    deptImage: predefinedImages[prev.length % predefinedImages.length],
                },
            ]);
        } catch (error) {
            console.error("Error adding new department:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="/tempImg.jpg"
                    alt="Campus Background"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center text-text">
                <h1 className="text-4xl font-bold mb-4">Academic Resource Hub</h1>
                <p className="text-lg text-muted mb-6">
                    Discover a comprehensive platform designed to enhance your academic journey.
                </p>
                <Button className="bg-primary text-text hover:bg-primary/90">
                    Explore Now
                </Button>
            </div>

            <div className="relative z-20 max-w-6xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-text">Choose Your Branch</h2>
                    {isWebHandler && (
                        <Button
                            onClick={handleNewDep}
                            className="bg-primary text-text hover:bg-primary/90 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add New Department
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch, index) => (
                        <Card
                            key={branch.id}
                            className="bg-card border-muted overflow-hidden transform transition-all duration-500 ease-in-out"
                            data-loaded={false}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className="h-48 bg-cover bg-center relative"
                                style={{
                                    backgroundImage: `url(${branch.deptImage })`,
                                    opacity: 0.9,
                                }}
                            >
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="relative z-10 h-full flex items-center justify-center">
                                    <Button
                                        variant="outline"
                                        className="text-text hover:text-primary w-full h-full flex flex-col items-center justify-center bg-transparent hover:bg-black/20 transition-all"
                                        onClick={() => handleBranchClick(branch.id)}
                                    >
                                        <BookOpen className="w-8 h-8 mb-2" />
                                        <span className="text-lg font-medium">{branch.name}</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <AddDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddDepartment}
            />
        </div>
    );
}