import React from 'react';

const JoinFormModal = ({
  showJoinForm,
  setShowJoinForm,
  joinFormData,
  setJoinFormData,
  handleJoinSubmit,
}) => {
  const availabilityOptions = ['full-time', 'part-time', 'weekend', 'flexible'];

  if (!showJoinForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#BF0C4F] to-[#870029] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Project: {showJoinForm.title}
            </h2>
            <button
              onClick={() => setShowJoinForm(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2">Submit your application to join this project</p>
        </div>

        <form onSubmit={handleJoinSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <input
              type="text"
              value={joinFormData.role || ''}
              onChange={(e) => setJoinFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              placeholder="Enter the role you're applying for"
              required
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{joinFormData.role?.length || 0}/50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivation *
            </label>
            <textarea
              value={joinFormData.motivation || ''}
              onChange={(e) => setJoinFormData(prev => ({ ...prev, motivation: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all resize-none"
              placeholder="Why do you want to join this project? (min 20 characters)"
              rows={4}
              required
              minLength={20}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{joinFormData.motivation?.length || 0}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Availability *
            </label>
            <select
              value={joinFormData.availability || ''}
              onChange={(e) => setJoinFormData(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all"
              required
            >
              <option value="">Select availability</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Experience *
            </label>
            <textarea
              value={joinFormData.experience || ''}
              onChange={(e) => setJoinFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#BF0C4F] focus:border-transparent transition-all resize-none"
              placeholder="Describe your relevant experience (min 10 characters)"
              rows={4}
              required
              minLength={10}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{joinFormData.experience?.length || 0}/500 characters</p>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowJoinForm(null)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#BF0C4F] to-[#870029] text-white rounded-xl hover:from-[#870029] hover:to-[#6B0022] transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinFormModal;