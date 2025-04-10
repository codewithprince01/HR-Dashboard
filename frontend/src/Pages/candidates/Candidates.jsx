import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';
import AddCandidate from './AddCandidate';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates, updateCandidateStatus, deleteCandidate } from '../../features/candidateSlice';

const Candidates = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector(state => state.candidates);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingCandidateId, setDeletingCandidateId] = useState(null);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const candidates = Array.isArray(data) ? data : [];

  const handleAddCandidate = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const toggleActionMenu = (id) => {
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      await dispatch(updateCandidateStatus({ id, status: newStatus })).unwrap();
      setActionMenuOpen(null);
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setDeletingCandidateId(id);
      try {
        await dispatch(deleteCandidate(id)).unwrap();
        setActionMenuOpen(null);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setDeletingCandidateId(null);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-white border border-gray-300 text-gray-700';
      case 'Ongoing': return 'bg-white border border-blue-400 text-blue-500';
      case 'Selected': return 'bg-white border border-[#4d007d] text-[#4d007d]';
      case 'Rejected': return 'bg-white border border-[#b70000] text-[#b70000]';
      default: return 'bg-white border border-gray-300 text-gray-700';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || candidate.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  if (status === 'loading') return <div className="text-center py-8">Loading candidates...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d007d] cursor-pointer w-full"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d007d] cursor-pointer w-full"
            >
              <option value="All">All Positions</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Human Resource Manager">Human Resource Manager</option>
              <option value="Full Time Designer">Full Time Designer</option>
              <option value="Full Time Developer">Full Time Developer</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 pr-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#4d007d]"
            />
          </div>
          <button
            onClick={handleAddCandidate}
            className="bg-[#4d007d] text-white px-4 py-2 rounded-md hover:bg-[#3b0060] transition-colors w-full sm:w-auto"
          >
            Add Candidate
          </button>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#4d007d] text-white text-left">
              <th className="py-3 px-4">Sr no.</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate, index) => (
              <tr key={`${candidate._id}-${index}`} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-4">{index + 1}</td>
                <td className="py-4 px-4">{candidate.name}</td>
                <td className="py-4 px-4">{candidate.email}</td>
                <td className="py-4 px-4">{candidate.phone}</td>
                <td className="py-4 px-4">{candidate.position}</td>

                {/* Status Dropdown */}
                <td className="py-4 px-4 relative">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleActionMenu(`status-${candidate._id}`)}
                      className={`${getStatusStyle(candidate.status)} px-4 py-1 rounded-full flex items-center ${
                        updatingStatusId === candidate._id ? 'opacity-50' : ''
                      }`}
                      disabled={updatingStatusId === candidate._id}
                    >
                      {candidate.status}
                      {updatingStatusId === candidate._id ? (
                        <span className="ml-2">Updating...</span>
                      ) : (
                        <FaChevronDown className="ml-2 w-3 h-3" />
                      )}
                    </button>
                    {actionMenuOpen === `status-${candidate._id}` && (
                      <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                        {['New', 'Ongoing', 'Selected', 'Rejected'].map((statusOption) => (
                          <button
                            key={`${candidate._id}-${statusOption}`}
                            onClick={() => handleUpdateStatus(candidate._id, statusOption)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              candidate.status === statusOption 
                                ? 'bg-[#4d007d] text-white' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">{candidate.experience || '-'}</td>

                {/* Action Dropdown */}
                <td className="py-4 px-4 relative">
                  <button
                    onClick={() => toggleActionMenu(candidate._id)}
                    className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                    disabled={deletingCandidateId === candidate._id}
                  >
                    {deletingCandidateId === candidate._id ? 'Deleting...' : <FaEllipsisV />}
                  </button>
                  {actionMenuOpen === candidate._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <a
                          href={`http://localhost:8080/api/candidates/${candidate._id}/resume`}
                          download
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Download Resume
                        </a>
                        <button
                          onClick={() => handleDeleteCandidate(candidate._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-red-600 hover:text-red-800"
                          disabled={deletingCandidateId === candidate._id}
                        >
                          Delete Candidate
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddCandidate isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Candidates;