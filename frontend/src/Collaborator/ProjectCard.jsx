import React from "react";

const ProjectCard = ({
  project,
  isOwner,
  openEditModal,
  handleDelete,
  openRequestsModal,
  openJoinFormModal,
}) => (
  <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 flex flex-col border border-gray-200"
    style={{ borderLeft: "4px solid #BF0C4F" }}
  >
    {/* Project Title */}
    <h2 className="text-xl font-bold text-[#BF0C4F]">{project.title}</h2>
    <p className="text-gray-600 text-sm">{project.domain}</p>

    {/* Description */}
    <p className="text-gray-700 mt-2">{project.description}</p>

    {/* Leader, Members, Status */}
    <p className="text-sm mt-2">
      👤 <span className="font-medium">{project.leaderName}</span>
    </p>
    <p className="text-sm">
      👥 {project.currentMembers}/{project.teamSize} members
    </p>
    <p className="text-sm">
      ⚡ <span className="capitalize">{project.status}</span>
    </p>

    {/* Skills */}
    {project.skills?.length > 0 && (
      <p className="text-sm mt-2">
        🛠 Skills:{" "}
        <span className="font-medium">{project.skills.join(", ")}</span>
      </p>
    )}

    {/* Buttons */}
    <div className="flex gap-3 mt-4">
      {isOwner ? (
        <>
          <button
            onClick={() => openEditModal(project)}
            className="px-3 py-1 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "#F4A300" }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(project._id)}
            className="px-3 py-1 rounded-lg text-white hover:bg-red-700 transition-colors"
            style={{ backgroundColor: "#BF0C4F" }}
          >
            Delete
          </button>

          <button
            onClick={() => openRequestsModal(project._id)}
            className="px-3 py-1 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "#333333" }}
          >
            Requests
          </button>
        </>
      ) : (
        <button
          onClick={() => openJoinFormModal(project)}
          className="px-3 py-1 rounded-lg text-white transition-colors"
          style={{
            backgroundColor:
              project.currentMembers >= project.teamSize
                ? "#666666"
                : "#BF0C4F",
          }}
          disabled={project.currentMembers >= project.teamSize}
        >
          Join
        </button>
      )}
    </div>
  </div>
);

export default ProjectCard;