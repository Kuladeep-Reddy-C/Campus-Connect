import React from 'react';

const RequestsModal = ({
  showRequestsFor,
  setShowRequestsFor,
  requests,
  handleRequestAction,
}) => {
  if (!showRequestsFor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#BF0C4F] to-[#870029] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-7m-2-5h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Join Requests
            </h2>
            <button
              onClick={() => setShowRequestsFor(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/80 mt-2">Review join requests for your project</p>
        </div>
        <div className="p-6 space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center">No join requests for this project.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">{request.userName}</span>
                  <span className={`font-medium ${
                    request.status === 'approved' ? 'text-green-600' :
                    request.status === 'rejected' ? 'text-red-600' : 'text-[#F4A300]'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {request.userEmail}</p>
                <p className="text-sm text-gray-600"><strong>Role:</strong> {request.role}</p>
                <p className="text-sm text-gray-600"><strong>Motivation:</strong> {request.motivation}</p>
                <p className="text-sm text-gray-600"><strong>Availability:</strong> {request.availability.charAt(0).toUpperCase() + request.availability.slice(1)}</p>
                <p className="text-sm text-gray-600"><strong>Experience:</strong> {request.experience}</p>
                {request.status === 'pending' && (
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleRequestAction(request._id, 'approved', showRequestsFor)}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequestAction(request._id, 'rejected', showRequestsFor)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsModal;