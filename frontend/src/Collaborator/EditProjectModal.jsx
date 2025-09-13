import React from 'react';

const EditProjectModal = ({
  editingProject,
  setEditingProject,
  formData,
  setFormData,
  handleUpdate,
}) => {
  const domains = [
    'Web Development',
    'Data Science',
    'Mobile Development',
    'IoT',
    'AI/ML',
    'Cybersecurity',
    'Game Development',
    'DevOps'
  ];

  const handleSkillAdd = (skillInput) => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      return true;
    }
    return false;
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const success = handleSkillAdd(e.target.value);
      if (success) {
        e.target.value = '';
      }
    }
  };

  if (!editingProject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#BF0C4F] to-[#870029] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </h2>
            <button
              onClick={() => setEditingProject(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2">Update the details below to modify your project</p>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              placeholder="Enter your project title (5-100 characters)"
              required
              minLength={5}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title?.length || 0}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Domain *
            </label>
            <select
              value={formData.domain || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              required
            >
              <option value="">Select a domain</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all resize-none"
              placeholder="Describe your project in detail (min 20 characters)"
              rows={4}
              required
              minLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description?.length || 0} characters (min 20)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Size *
              </label>
              <input
                type="number"
                value={formData.teamSize || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
                placeholder="Enter team size (1-10)"
                required
                min={1}
                max={10}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 10 members</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Leader Name *
              </label>
              <input
                type="text"
                value={formData.leaderName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, leaderName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
                placeholder="Enter leader name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Required Skills *
            </label>
            <input
              type="text"
              onKeyPress={handleSkillKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              placeholder="Type a skill and press Enter to add"
            />
            
            {formData.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#BF0C4F] text-white text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {(!formData.skills || formData.skills.length === 0) && (
              <p className="text-xs text-red-500 mt-1">Please add at least one skill</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              required
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#BF0C4F] to-[#870029] text-white rounded-xl hover:from-[#870029] hover:to-[#6B0022] transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;