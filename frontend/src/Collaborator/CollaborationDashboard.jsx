import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ProjectCard from "./ProjectCard.jsx";
import Modals from "./Modals.jsx";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

const CollaborationDashboard = () => {
  const { user } = useUser();
  const url = import.meta.env.VITE_BACKEND_URL;
  console.log(url);
  const [projects, setProjects] = useState([]);
  const [joinForms, setJoinForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    description: "",
    teamSize: "",
    leaderName: "",
    skills: [],
    status: "active",
    adminEmail: "",
    createdBy: "",
  });
  const [showRequestsFor, setShowRequestsFor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showJoinForm, setShowJoinForm] = useState(null);
  const [joinFormData, setJoinFormData] = useState({
    projectId: "",
    role: "",
    userId: "",
    userName: "",
    userEmail: "",
    motivation: "",
    availability: "",
    experience: "",
  });
  const [showOtherProjects, setShowOtherProjects] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [createProjectData, setCreateProjectData] = useState({
    title: "",
    domain: "",
    description: "",
    teamSize: "",
    skills: [],
    leaderName: "",
    status: "active",
    adminEmail: "",
    createdBy: "",
  });

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userId = user?.id;
  const userName = user?.fullName;

  useEffect(() => {
    const fetchProjectsAndForms = async () => {
      try {
        const [projectRes, formRes] = await Promise.all([
          fetch(url+"/api/projects"),
          fetch(url+"/api/join-forms"),
        ]);

        if (!projectRes.ok) throw new Error("Failed to fetch projects");
        if (!formRes.ok) throw new Error("Failed to fetch join forms");

        const projectData = await projectRes.json();
        const formData = await formRes.json();

        setProjects(projectData);
        setJoinForms(formData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchProjectsAndForms();
    }
  }, [userEmail]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(url+`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      domain: project.domain,
      description: project.description,
      teamSize: project.teamSize,
      leaderName: project.leaderName,
      skills: project.skills || [],
      status: project.status,
      adminEmail: project.adminEmail,
      createdBy: project.createdBy,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.skills.length === 0) {
        alert("Please add at least one skill.");
        return;
      }
      const res = await fetch(url+`/api/projects/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          teamSize: parseInt(formData.teamSize),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update project");
      }
      const updatedProject = await res.json();
      setProjects((prev) =>
        prev.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
      setEditingProject(null);
      alert("Project updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      alert(`Failed to update project: ${err.message}`);
    }
  };

  const openRequestsModal = async (projectId) => {
  try {
    // call your backend route
    const res = await fetch(
      url+`/api/join-forms/project/${projectId}`
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch join requests");
    }

    const forms = await res.json();
    setRequests(forms);         // update state with forms from DB
    setShowRequestsFor(projectId);
  } catch (err) {
    console.error("Failed to load join requests", err);
    alert(err.message);
  }
};

  const handleRequestAction = async (requestId, status, projectId) => {
    try {
      const project = projects.find((p) => p._id === projectId);
      if (!project) {
        alert("Project not found.");
        return;
      }

      if (status === "approved" && project.currentMembers >= project.teamSize) {
        alert("Team is full. Cannot approve more members.");
        return;
      }

      const res = await fetch(url+`/api/join-forms/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update request");
      }

      const updatedRequest = await res.json();
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? updatedRequest : req))
      );
      setJoinForms((prev) =>
        prev.map((req) => (req._id === requestId ? updatedRequest : req))
      );

      if (status === "approved") {
        const projectRes = await fetch(url+`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentMembers: project.currentMembers + 1,
          }),
        });
        if (!projectRes.ok) {
          const errorData = await projectRes.json();
          throw new Error(errorData.message || "Failed to update project members");
        }
        const updatedProject = await projectRes.json();
        setProjects((prev) =>
          prev.map((project) =>
            project._id === projectId ? updatedProject : project
          )
        );
      }
    } catch (err) {
      console.error("Request update failed", err);
      alert(`Failed to update request: ${err.message}`);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      const res = await fetch(url+`/api/join-forms/${requestId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to cancel request");
      }
      setJoinForms((prev) => prev.filter((f) => f._id !== requestId));
      setRequests((prev) => prev.filter((f) => f._id !== requestId));
    } catch (err) {
      console.error("Cancel request failed", err);
      alert(`Failed to cancel request: ${err.message}`);
    }
  };

  const openJoinFormModal = (project) => {
    setShowJoinForm(project);
    setJoinFormData({
      projectId: project._id,
      role: "",
      userId: userId || "",
      userName: userName || "",
      userEmail: userEmail || "",
      motivation: "",
      availability: "",
      experience: "",
    });
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      const hasRequested = joinForms.some(
        (form) => form.projectId === showJoinForm._id && form.userEmail === userEmail
      );
      if (hasRequested) {
        alert("You have already submitted a join request for this project.");
        return;
      }

      const res = await fetch(url+"/api/join-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinFormData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit join request");
      }

      const newForm = await res.json();
      setJoinForms((prev) => [...prev, newForm]);
      setShowJoinForm(null);
      alert("Join request submitted successfully!");
    } catch (err) {
      console.error("Join request failed", err);
      alert(`Failed to submit join request: ${err.message}`);
    }
  };

  const openCreateProjectModal = () => {
    setShowCreateProject(true);
    setCreateProjectData({
      title: "",
      domain: "",
      description: "",
      teamSize: "",
      skills: [],
      leaderName: userName || "",
      status: "active",
      adminEmail: userEmail || "",
      createdBy: userId || "",
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(url+"/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createProjectData,
          teamSize: parseInt(createProjectData.teamSize),
          currentMembers: 1,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);
      setShowCreateProject(false);
      setCreateProjectData({
        title: "",
        domain: "",
        description: "",
        teamSize: "",
        skills: [],
        leaderName: "",
        status: "active",
        adminEmail: userEmail || "",
        createdBy: userId || "",
      });
      alert("Project created successfully!");
    } catch (err) {
      console.error("Create project failed", err);
      alert(`Failed to create project: ${err.message}`);
    }
  };

  // Chart Data Preparation
  const getWeekNumber = (date) => {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - start) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Bar Chart: Projects per Week
  const projectsPerWeek = projects.reduce((acc, project) => {
    const week = project.createdAt ? getWeekNumber(project.createdAt) : "Unknown";
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(projectsPerWeek).sort((a, b) => a - b),
    datasets: [
      {
        label: "Projects Created",
        data: Object.values(projectsPerWeek),
        backgroundColor: "#BF0C4F",
      },
    ],
  };

  // Donut Chart: Projects by Domain
  const projectsByDomain = projects.reduce((acc, project) => {
    acc[project.domain] = (acc[project.domain] || 0) + 1;
    return acc;
  }, {});

  const donutData = {
    labels: Object.keys(projectsByDomain),
    datasets: [
      {
        data: Object.values(projectsByDomain),
        backgroundColor: ["#BF0C4F", "#F4A300", "#4CAF50", "#333333", "#666666"],
      },
    ],
  };

  // Line Chart: Join Requests Over Time
  const requestsPerWeek = joinForms.reduce((acc, form) => {
    const week = form.joinedAt ? getWeekNumber(form.joinedAt) : "Unknown";
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(requestsPerWeek).sort((a, b) => a - b),
    datasets: [
      {
        label: "Join Requests",
        data: Object.values(requestsPerWeek),
        borderColor: "#F4A300",
        fill: false,
      },
    ],
  };

  // Pie Chart: Role Distribution
  const roleDistribution = joinForms.reduce((acc, form) => {
    const role = form.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(roleDistribution),
    datasets: [
      {
        data: Object.values(roleDistribution),
        backgroundColor: ["#BF0C4F", "#F4A300", "#4CAF50", "#333333", "#666666"],
      },
    ],
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#BF0C4F]"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-[#BF0C4F] font-semibold mt-10">{error}</div>
    );

  const myProjects = projects.filter((p) => p.adminEmail === userEmail);
  const otherProjects = projects.filter((p) => p.adminEmail !== userEmail);
  const myForms = joinForms.filter((f) => f.userEmail === userEmail);
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const activeRequests = myForms.filter((f) => f.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#BF0C4F] to-[#870029] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Project Dashboard</h1>
              <p className="text-white/80">Manage and explore collaborative projects</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={openCreateProjectModal}
                className="px-8 py-3 bg-[#F4A300] text-white rounded-xl hover:bg-[#E6920D] transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Project
              </button>
              <button
                onClick={() => setShowOtherProjects(!showOtherProjects)}
                className="px-8 py-3 bg-white text-[#BF0C4F] rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                {showOtherProjects ? "View My Projects" : "Browse Projects"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Projects</p>
                <p className="text-4xl font-bold text-[#BF0C4F]">{projects.length}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-[#BF0C4F] to-[#870029] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Active Projects</p>
                <p className="text-4xl font-bold text-[#F4A300]">{activeProjects}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-[#F4A300] to-[#E6920D] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Active Requests</p>
                <p className="text-4xl font-bold text-[#BF0C4F]">{activeRequests}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-[#BF0C4F] to-[#870029] rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Projects per Week</p>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true }, title: { display: false } },
                }}
              />
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Projects by Domain</p>
              <Doughnut
                data={donutData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom" }, title: { display: false } },
                }}
              />
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Join Requests Over Time</p>
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true }, title: { display: false } },
                }}
              />
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Role Distribution</p>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom" }, title: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {showOtherProjects ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Explore Projects</h2>
              <div className="bg-white px-4 py-2 rounded-full shadow-md">
                <p className="text-sm text-gray-600 font-medium">{otherProjects.length} projects available</p>
              </div>
            </div>
            {otherProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-gray-500 text-xl">No other projects available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new collaboration opportunities!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    isOwner={false}
                    openJoinFormModal={openJoinFormModal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Projects</h2>
                <div className="bg-[#BF0C4F] text-white px-4 py-2 rounded-full shadow-md">
                  <p className="text-sm font-medium">{myProjects.length} projects</p>
                </div>
              </div>
              {myProjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-24 h-24 mx-auto bg-[#BF0C4F]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-[#BF0C4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl">You haven't created any projects yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Start your first collaborative project today!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      isOwner={true}
                      openEditModal={openEditModal}
                      handleDelete={handleDelete}
                      openRequestsModal={openRequestsModal}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Requests</h2>
                <div className="bg-[#F4A300] text-white px-4 py-2 rounded-full shadow-md">
                  <p className="text-sm font-medium">{myForms.length} requests</p>
                </div>
              </div>
              {myForms.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-24 h-24 mx-auto bg-[#F4A300]/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-[#F4A300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl">You haven't requested to join any projects.</p>
                  <p className="text-gray-400 text-sm mt-2">Browse available projects to find collaboration opportunities!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myForms.map((form) => {
                    const project = projects.find((p) => p._id === form.projectId);
                    return (
                      <div
                        key={form._id}
                        className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        <h3 className="text-xl font-bold text-[#BF0C4F] mb-4">
                          {project ? project.title : "Unknown Project"}
                        </h3>
                        <div className="space-y-3 text-sm mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Role:</span>
                            <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                              {form.role || "Unknown"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Status:</span>
                            <span
                              className={`font-semibold px-3 py-1 rounded-full ${
                                form.status === "approved"
                                  ? "text-green-700 bg-green-100"
                                  : form.status === "rejected"
                                  ? "text-red-700 bg-red-100"
                                  : "text-[#F4A300] bg-[#F4A300]/10"
                              }`}
                            >
                              {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Motivation:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{form.motivation}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Availability:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {form.availability.charAt(0).toUpperCase() + form.availability.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Experience:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{form.experience}</p>
                          </div>
                        </div>
                        {form.status === "pending" && (
                          <button
                            onClick={() => handleCancelRequest(form._id)}
                            className="mt-6 w-full px-6 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all font-semibold border border-red-200 hover:border-red-300"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modals
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        formData={formData}
        setFormData={setFormData}
        handleUpdate={handleUpdate}
        showJoinForm={showJoinForm}
        setShowJoinForm={setShowJoinForm}
        joinFormData={joinFormData}
        setJoinFormData={setJoinFormData}
        handleJoinSubmit={handleJoinSubmit}
        showRequestsFor={showRequestsFor}
        setShowRequestsFor={setShowRequestsFor}
        requests={requests}
        handleRequestAction={handleRequestAction}
        showCreateProject={showCreateProject}
        setShowCreateProject={setShowCreateProject}
        createProjectData={createProjectData}
        setCreateProjectData={setCreateProjectData}
        handleCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default CollaborationDashboard;
