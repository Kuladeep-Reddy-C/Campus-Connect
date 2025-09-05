import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { BookOpen } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { AddDepartmentModal } from "./components/AddDepartmentModal";
import { AddSubjectModal } from "./components/AddSubjectModal";

export function BranchSelector({ onBranchSelect }) {
    const { isLoaded, user } = useUser();
    const url = import.meta.env.VITE_BACKEND_URL;
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isWebHandler, setIsWebHandler] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchBranch = async () => {
            try {
                const response = await fetch(`${url}/res/dep`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (isMounted) {
                    const enhancedData = data.map((dept) => ({
                        ...dept,
                        id: dept._id,
                        name: dept.departmentName,
                    }));
                    setBranches(enhancedData);
                }
            } catch (error) {
                console.log(error)
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

    const handleBranchClick = (branchId) => {
        setSelectedBranch(branchId);
        setSelectedSubject("");
    };

    const handleSubjectSelect = (subjectId) => {
        setSelectedSubject(subjectId);
    };

    const handleOpenMindMap = () => {
        if (selectedBranch && selectedSubject) {
            window.open(`/resources/${selectedSubject}`, "_blank");
        }
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
                },
            ]);
        } catch (error) {
            console.error("Error adding new department:", error);
        }
    };

    const handleAddSubject = () => {
        setIsSubjectModalOpen(true);
    };

    const handleSubmitSubject = async (subjectName) => {
        try {
            const subResponse = await fetch(`${url}/res/sub`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: subjectName, creatorId: user.id }),
            });
            if (!subResponse.ok) {
                console.log("error came in post sub")
                throw new Error(`HTTP error! status: ${subResponse.status}`);
            }
            const newSubject = await subResponse.json();
            const newSubjectId = newSubject._id;

            const currentSubjects = selectedDept?.subjects || [];
            const updatedSubjects = [
                ...currentSubjects,
                { subject_id: newSubjectId, subject_name: subjectName },
            ];

            const depResponse = await fetch(`${url}/res/dep/${selectedBranch}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subjects: updatedSubjects }),
            });
            if (!depResponse.ok) {
                throw new Error(`HTTP error! status: ${depResponse.status}`);
            }

            setBranches((prev) =>
                prev.map((branch) =>
                    branch.id === selectedBranch
                        ? { ...branch, subjects: updatedSubjects }
                        : branch
                )
            );
        } catch (error) {
            console.log(error)
            console.error("Error adding new subject:", error);
        }
    };

    const selectedDept = branches.find((b) => b.id === selectedBranch);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-4xl bg-card shadow-lg border border-muted overflow-hidden">
                <div className="bg-primary p-8 text-center">
                    <BookOpen className="w-16 h-16 text-text mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-text mb-2">Academic Mind Map</h1>
                    <p className="text-text/80 text-lg">
                        Navigate your learning journey through interactive knowledge trees
                    </p>
                </div>

                <div className="p-8 space-y-12">
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-text">Choose Your Branch</h2>
                        {isWebHandler && (
                            <Button
                                onClick={handleNewDep}
                                className="m-4 bg-primary hover:bg-primary/90 text-text"
                            >
                                Add New Department
                            </Button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {branches.map((branch) => (
                                <Button
                                    key={branch.id}
                                    variant={selectedBranch === branch.id ? "default" : "outline"}
                                    className={`h-24 flex flex-col gap-2 transition-all duration-300 hover:shadow-md relative overflow-hidden ${selectedBranch === branch.id
                                            ? "bg-primary text-text"
                                            : "bg-card hover:bg-background"
                                        }`}
                                    onClick={() => handleBranchClick(branch.id)}
                                >
                                    <style jsx>{`
                                        .hover-slide::before {
                                            content: '';
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            background: rgba(59, 130, 246, 0.2);
                                            transform: translateX(-100%);
                                            transition: transform 0.3s ease-in-out;
                                            z-index: 0;
                                        }
                                        .hover-slide:hover::before {
                                            transform: translateX(0);
                                        }
                                        .hover-slide > * {
                                            position: relative;
                                            z-index: 1;
                                        }
                                    `}</style>
                                    <div className="hover-slide flex flex-col items-center justify-center w-full h-full">
                                        <BookOpen
                                            className={`w-6 h-6 ${selectedBranch === branch.id ? "text-text" : "text-primary"
                                                }`}
                                        />
                                        <span className="text-sm text-center leading-tight text-text">
                                            {branch.name}
                                        </span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {selectedBranch && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-6 text-text">Select Topic</h2>
                            {isWebHandler && (
                                <Button
                                    onClick={handleAddSubject}
                                    className="mb-4 bg-primary hover:bg-primary/90 text-text"
                                >
                                    Add a RoadMap
                                </Button>
                            )}
                            <Select onValueChange={handleSubjectSelect} value={selectedSubject}>
                                <SelectTrigger className="w-full h-14 text-lg bg-card border border-muted text-text focus:ring-2 focus:ring-primary">
                                    <SelectValue placeholder="Choose a subject to explore..." />
                                </SelectTrigger>
                                <SelectContent className="bg-card border border-muted z-10 max-h-80 overflow-y-auto">
                                    {selectedDept?.subjects?.map((subject) => (
                                        <SelectItem
                                            key={subject.subject_id}
                                            value={subject.subject_id}
                                            className="text-lg py-3 text-text hover:bg-background"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm text-muted">{subject.subject_name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedBranch && selectedSubject && (
                        <div className="flex justify-center mt-8">
                            <Button
                                onClick={handleOpenMindMap}
                                className="bg-primary hover:bg-primary/90 text-text px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                            >
                                Open Mind Map
                                <BookOpen className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>

                <AddDepartmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddDepartment}
                />
                <AddSubjectModal
                    isOpen={isSubjectModalOpen}
                    onClose={() => setIsSubjectModalOpen(false)}
                    onSubmit={handleSubmitSubject}
                />
            </Card>
        </div>
    );
}