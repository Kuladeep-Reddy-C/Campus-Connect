import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, Eye, Star, MessageCircle, Calendar, MessageSquare,User, Tag, Hash, Plus, ExternalLink, X } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AddSubjectModal } from "./components/AddSubjectModal";
import { toast } from "react-toastify";

// Mock UI components
const Button = ({ children, onClick, variant = "default", className = "", disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${variant === "outline"
            ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            : "bg-[var(--primary)] text-white hover:bg-[color-mix(in_srgb,var(--primary)_80%,#000)]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} ${className}`}
    >
        {children}
    </button>
);

const Card = ({ children, className = "", isCurrentUser = false }) => (
    <div
        className={`bg-[var(--card)] rounded-lg border ${isCurrentUser ? "border-[var(--primary)] border-2" : "border-[var(--muted)]"
            } shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
        {children}
    </div>
);

// Comment Dialog Component
const CommentDialog = ({ isOpen, onClose, onSubmit, subjectId }) => {
    const [commentText, setCommentText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }
        await onSubmit(commentText);
        setCommentText("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[var(--text)]">Add Comment</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-[var(--text)]" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Enter your comment..."
                        className="w-full p-2 border border-[var(--muted)] rounded-md resize-none h-24 bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <div className="mt-4 flex justify-end">
                        <Button type="submit">Submit Comment</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function SubjectSelector() {
    const { isLoaded, user } = useUser();
    const { getToken } = useAuth();
    const { departmentId } = useParams();
    const url = import.meta.env.VITE_BACKEND_URL;
    const [department, setDepartment] = useState(null);
    const [subjectDetails, setSubjectDetails] = useState({});
    const [creatorInfo, setCreatorInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [visibleSubjects, setVisibleSubjects] = useState(3);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isWebHandler, setIsWebHandler] = useState(false);
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [showComments, setShowComments] = useState({});
    const [sortBy, setSortBy] = useState("default"); // Sorting state
    const loadMoreRef = useRef(null);

    // Fetch department data
    const fetchDepartment = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const response = await fetch(`${url}/res/dep/${departmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDepartment({
                id: data._id,
                name: data.departmentName,
                subjects: data.subjects || [],
            });
        } catch (error) {
            console.error("Error fetching department:", error);
            toast.error(`Failed to fetch department: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const token = await getToken();
            console.log("Fetching user data for userId:", user.id);
            const response = await fetch(`${url}/user-info/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error response:", errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("User data response:", data);

            if (data?.user?.id === user?.id) {
                setIsWebHandler(data.user.publicMetadata?.isWebHandler || false);
            } else {
                setIsWebHandler(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error(`Error fetching user data: ${error.message}`);
        }
    };

    // Fetch subject details
    const fetchSubjectDetails = useCallback(
        async (subjectId) => {
            if (subjectDetails[subjectId]) return;

            setLoading(true);
            try {
                const token = await getToken();
                const response = await fetch(`${url}/res/sub/${subjectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSubjectDetails((prev) => ({
                    ...prev,
                    [subjectId]: data,
                }));

                if (data.creatorId && !creatorInfo[data.creatorId]) {
                    const userResponse = await fetch(`${url}/user-info/${data.creatorId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setCreatorInfo((prev) => ({
                            ...prev,
                            [data.creatorId]: userData.user,
                        }));
                    } else {
                        console.error("Error fetching creator info:", await userResponse.json());
                    }
                }
            } catch (error) {
                console.error("Error fetching subject details:", error);
                toast.error(`Failed to fetch subject details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        },
        [subjectDetails, creatorInfo, url, getToken]
    );

    // Increment views
    const incrementViews = async (subjectId) => {
        try {
            const token = await getToken();
            const response = await fetch(`${url}/res/sub/${subjectId}/views`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedSubject = await response.json();
            setSubjectDetails((prev) => ({
                ...prev,
                [subjectId]: updatedSubject,
            }));
        } catch (error) {
            console.error("Error incrementing views:", error);
            toast.error(`Failed to increment views: ${error.message}`);
        }
    };

    // Toggle star
    const toggleStar = async (subjectId) => {
        try {
            const token = await getToken();
            const response = await fetch(`${url}/res/sub/${subjectId}/star`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedSubject = await response.json();
            setSubjectDetails((prev) => ({
                ...prev,
                [subjectId]: updatedSubject,
            }));
        } catch (error) {
            console.error("Error toggling star:", error);
            toast.error(`Failed to toggle star: ${error.message}`);
        }
    };

    // Add comment
    const addComment = async (subjectId, text) => {
        try {
            const token = await getToken();
            const response = await fetch(`${url}/res/sub/${subjectId}/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedSubject = await response.json();
            setSubjectDetails((prev) => ({
                ...prev,
                [subjectId]: updatedSubject,
            }));

            // Fetch commenter info if not already cached
            const commenterId = user.id;
            if (!creatorInfo[commenterId]) {
                const userResponse = await fetch(`${url}/user-info/${commenterId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setCreatorInfo((prev) => ({
                        ...prev,
                        [commenterId]: userData.user,
                    }));
                }
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error(`Failed to add comment: ${error.message}`);
        }
    };

    // Load more subjects
    const loadMoreSubjects = () => {
        if (department?.subjects && visibleSubjects < department.subjects.length) {
            const newVisible = Math.min(visibleSubjects + 3, department.subjects.length);
            setVisibleSubjects(newVisible);

            // Fetch details for newly visible subjects
            for (let i = visibleSubjects; i < newVisible; i++) {
                const subject = department.subjects[i];
                fetchSubjectDetails(subject.subject_id);
            }
        }
    };

    // Initial fetches
    useEffect(() => {
        if (isLoaded) {
            fetchDepartment();
            fetchUserData();
        }
    }, [isLoaded, departmentId, url, user?.id]);

    // Fetch details for visible subjects
    useEffect(() => {
        if (department?.subjects) {
            const subjectsToLoad = department.subjects.slice(0, visibleSubjects);
            subjectsToLoad.forEach((subject) => {
                fetchSubjectDetails(subject.subject_id);
            });
        }
    }, [department, visibleSubjects, fetchSubjectDetails]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && visibleSubjects < department?.subjects?.length && !loading) {
                    loadMoreSubjects();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [visibleSubjects, department?.subjects?.length, loading]);

    const handleAddSubject = () => {
        setIsAddModalOpen(true);
    };

    const handleSubmitSubject = async (subjectName) => {
        try {
            const token = await getToken();
            const subResponse = await fetch(`${url}/res/sub`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: subjectName, creatorId: user.id, deptId: departmentId }),
            });
            if (!subResponse.ok) {
                const errorData = await subResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${subResponse.status}`);
            }
            const newSubject = await subResponse.json();
            const newSubjectId = newSubject._id;

            const updatedSubjects = [
                ...department.subjects,
                { subject_id: newSubjectId, subject_name: subjectName },
            ];

            const depResponse = await fetch(`${url}/res/dep/${departmentId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subjects: updatedSubjects }),
            });
            if (!depResponse.ok) {
                const errorData = await depResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${depResponse.status}`);
            }

            setDepartment((prev) => ({
                ...prev,
                subjects: updatedSubjects,
            }));

            // Fetch details for the new subject
            fetchSubjectDetails(newSubjectId);
            setVisibleSubjects((prev) => prev + 1);
        } catch (error) {
            console.error("Error adding new subject:", error);
            toast.error(`Failed to add subject: ${error.message}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Sorting function
    const getSortedSubjects = () => {
        if (!department?.subjects) return [];

        const subjectsWithDetails = department.subjects.map((subject) => ({
            ...subject,
            details: subjectDetails[subject.subject_id] || {},
        }));

        switch (sortBy) {
            case "stars":
                return subjectsWithDetails.sort(
                    (a, b) => (b.details.stars?.length || 0) - (a.details.stars?.length || 0)
                );
            case "views":
                return subjectsWithDetails.sort(
                    (a, b) => (b.details.views || 0) - (a.details.views || 0)
                );
            case "comments":
                return subjectsWithDetails.sort(
                    (a, b) => (b.details.comments?.length || 0) - (a.details.comments?.length || 0)
                );
            case "newlyCreated":
                return subjectsWithDetails.sort(
                    (a, b) =>
                        new Date(b.details.createdAt || 0).getTime() -
                        new Date(a.details.createdAt || 0).getTime()
                );
            default:
                return subjectsWithDetails;
        }
    };

    const SubjectCard = ({ subject, details, creator }) => (
        <Card className="mb-4 hover:bg-[color-mix(in_srgb,var(--card)_95%,var(--primary)_5%)] transition-colors duration-200" isCurrentUser={details?.creatorId === user?.id}>
            <div className="p-4">
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--text)] flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-[var(--primary)]" />
                            {subject.subject_name}
                            {details?.creatorId === user?.id && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--primary)] text-white">
                                    Your Roadmap
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[var(--muted)] mt-1">
                            <span className="flex items-center">
                                <Hash className="w-4 h-4 mr-1" />
                                {subject.subject_id.slice(0, 8)}
                            </span>
                            {details && (
                                <>
                                    <span className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1 text-[var(--primary)]" />
                                        {details.views || 0}
                                    </span>
                                    <span
                                        className="flex items-center cursor-pointer hover:text-[var(--primary)]"
                                        onClick={() => toggleStar(subject.subject_id)}
                                    >
                                        <Star
                                            className={`w-4 h-4 mr-1 ${details.stars.includes(user.id) ? "fill-[var(--primary)] text-[var(--primary)]" : ""}`}
                                        />
                                        {details.stars?.length || 0}
                                    </span>
                                    <span
                                        className="flex items-center cursor-pointer hover:text-[var(--primary)]"
                                        onClick={() => {
                                            setShowComments((prev) => ({
                                                ...prev,
                                                [subject.subject_id]: !prev[subject.subject_id],
                                            }));
                                        }}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        {details.comments?.length || 0}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="ml-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-full"
                                        onClick={() => {
                                            setSelectedSubjectId(subject.subject_id);
                                            setIsCommentDialogOpen(true);
                                        }}
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            incrementViews(subject.subject_id);
                            window.open(`/resources/${subject.subject_id}`, "_blank");
                        }}
                        className="ml-4"
                    >
                        
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>

                {details && (
                    <div className="space-y-3">
                        {/* Creator Info */}
                        {creator && (
                            <div className="flex items-center space-x-2 p-2 bg-[color-mix(in_srgb,var(--card)_90%,var(--primary)_10%)] rounded-md">
                                <img
                                    src={creator.imageUrl}
                                    alt={creator.firstName || "User"}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/32";
                                    }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-[var(--text)]">
                                        {creator.firstName} {creator.lastName || ""}
                                    </p>
                                    <p className="text-xs text-[var(--muted)]">{creator.emailAddresses[0]?.emailAddress || "No email"}</p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {details.tags && details.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {details.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[color-mix(in_srgb,var(--primary)_20%,#fff)] dark:bg-[color-mix(in_srgb,var(--primary)_20%,#333)] text-[var(--text)]"
                                    >
                                        <Tag className="w-3 h-3 mr-1 text-[var(--primary)]" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-[color-mix(in_srgb,var(--card)_95%,var(--primary)_5%)] rounded-md">
                            <div className="text-center">
                                <div className="text-sm font-semibold text-[var(--text)]">{details.nodes?.length || 0}</div>
                                <div className="text-xs text-[var(--muted)]">Nodes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-[var(--text)]">{details.edges?.length || 0}</div>
                                <div className="text-xs text-[var(--muted)]">Edges</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-[var(--text)]">{formatDate(details.createdAt)}</div>
                                <div className="text-xs text-[var(--muted)]">Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-semibold text-[var(--text)]">{formatDate(details.updatedAt)}</div>
                                <div className="text-xs text-[var(--muted)]">Updated</div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        {showComments[subject.subject_id] && details.comments && details.comments.length > 0 && (
                            <div className="mt-3 p-3 bg-[color-mix(in_srgb,var(--card)_90%,var(--primary)_10%)] rounded-md">
                                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">Comments</h4>
                                {details.comments.map((comment, index) => {
                                    const commenter = creatorInfo[comment.userId];
                                    return (
                                        <div key={index} className="flex items-start space-x-2 mb-2">
                                            {commenter && (
                                                <>
                                                    <img
                                                        src={commenter.imageUrl}
                                                        alt={commenter.firstName || "User"}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/24";
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="text-xs font-medium text-[var(--text)]">
                                                            {commenter.firstName} {commenter.lastName || ""}
                                                        </p>
                                                        <p className="text-xs text-[var(--muted)]">{comment.text}</p>
                                                        <p className="text-xs text-[var(--muted)] opacity-75">{formatDate(comment.createdAt)}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen bg-[var(--background)] p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--card)] p-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="w-8 h-8 text-[var(--primary)]" />
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--text)]">Academic Mind Map</h1>
                                <p className="text-[var(--muted)]">Explore subjects in {department?.name || "this department"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-2 border border-[var(--muted)] rounded-md bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            >
                                <option value="default">Sort by: Default</option>
                                <option value="stars">Sort by: Stars</option>
                                <option value="views">Sort by: Views</option>
                                <option value="comments">Sort by: Comments</option>
                                <option value="newlyCreated">Sort by: Newly Created</option>
                            </select>

                            <Button onClick={handleAddSubject}>
                                <Plus className="w-4 h-4" /> 
                            </Button>

                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {getSortedSubjects().slice(0, visibleSubjects).map((subject) => {
                        const details = subjectDetails[subject.subject_id];
                        const creator = creatorInfo[details?.creatorId];
                        return (
                            <SubjectCard
                                key={subject.subject_id}
                                subject={subject}
                                details={details}
                                creator={creator}
                            />
                        );
                    })}
                    {visibleSubjects < getSortedSubjects().length && (
                        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
                            {loading && <div className="text-[var(--muted)]">Loading more...</div>}
                        </div>
                    )}
                    {visibleSubjects >= getSortedSubjects().length && getSortedSubjects().length > 0 && (
                        <p className="text-center text-[var(--muted)]">All subjects loaded</p>
                    )}
                    {!getSortedSubjects().length && (
                        <p className="text-center text-[var(--muted)]">No subjects available. Add one to get started!</p>
                    )}
                </div>

                <AddSubjectModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleSubmitSubject}
                />
                <CommentDialog
                    isOpen={isCommentDialogOpen}
                    onClose={() => setIsCommentDialogOpen(false)}
                    onSubmit={(text) => addComment(selectedSubjectId, text)}
                    subjectId={selectedSubjectId}
                />
            </div>
        </div>
    );
}