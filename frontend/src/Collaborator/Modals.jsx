import React from 'react';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import JoinFormModal from './JoinFormModal';
import RequestsModal from './RequestsModal';

const Modals = ({
  // Edit Project Modal props
  editingProject,
  setEditingProject,
  formData,
  setFormData,
  handleUpdate,
  
  // Join Form Modal props
  showJoinForm,
  setShowJoinForm,
  joinFormData,
  setJoinFormData,
  handleJoinSubmit,
  
  // Requests Modal props
  showRequestsFor,
  setShowRequestsFor,
  requests,
  handleRequestAction,
  
  // Create Project Modal props
  showCreateProject,
  setShowCreateProject,
  createProjectData,
  setCreateProjectData,
  handleCreateProject
}) => {
  return (
    <>
      <CreateProjectModal
        showCreateProject={showCreateProject}
        setShowCreateProject={setShowCreateProject}
        createProjectData={createProjectData}
        setCreateProjectData={setCreateProjectData}
        handleCreateProject={handleCreateProject}
      />
      
      {editingProject && (
        <EditProjectModal
          editingProject={editingProject}
          setEditingProject={setEditingProject}
          formData={formData}
          setFormData={setFormData}
          handleUpdate={handleUpdate}
        />
      )}
      
      {showJoinForm && (
        <JoinFormModal
          showJoinForm={showJoinForm}
          setShowJoinForm={setShowJoinForm}
          joinFormData={joinFormData}
          setJoinFormData={setJoinFormData}
          handleJoinSubmit={handleJoinSubmit}
        />
      )}
      
      {showRequestsFor && (
        <RequestsModal
          showRequestsFor={showRequestsFor}
          setShowRequestsFor={setShowRequestsFor}
          requests={requests}
          handleRequestAction={handleRequestAction}
        />
      )}
    </>
  );
};

export default Modals;