import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';
import AddCandidate from './AddCandidate';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates, updateCandidateStatus, deleteCandidate } from '../../features/candidateSlice';

import '../../style/pages.css';


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
      setStatusFilter('All');
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
      case 'New': return 'status-new';
      case 'Ongoing': return 'status-ongoing';
      case 'Selected': return 'status-selected';
      case 'Rejected': return 'status-rejected';
      default: return 'status-new';
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

  if (status === 'loading') return <div className="loading">Loading candidates...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="candidates-container">

      <div className="filters-container">
        <div className="filters-group">
          <div className="select-container rounded-full">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <FaChevronDown className="chevron-icon" />
          </div>

          <div className="select-container">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="select"
            >
              <option value="All">All Positions</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Human Resource Manager">Human Resource Manager</option>
              <option value="Full Time Designer">Full Time Designer</option>
              <option value="Full Time Developer">Full Time Developer</option>
            </select>
            <FaChevronDown className="chevron-icon" />
          </div>
        </div>

        <div className="filters-group">
          <div className="search-containerr">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={handleAddCandidate}
            className="add-button"
          >
            Add Candidate
          </button>
        </div>
      </div>

     
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate, index) => (
              <tr key={`${candidate._id}-${index}`}>
                <td>{index + 1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.position}</td>

          
                <td>
                  <div className="status-container">
                    <button
                      onClick={() => toggleActionMenu(`status-${candidate._id}`)}
                      className={`status-button ${getStatusStyle(candidate.status)} ${updatingStatusId === candidate._id ? 'disabled' : ''}`}
                      disabled={updatingStatusId === candidate._id}
                    >
                      {candidate.status}
                      {updatingStatusId === candidate._id ? (
                        <span style={{ marginLeft: '8px' }}>Updating...</span>
                      ) : (
                        <FaChevronDown className="chevron-icon" />
                      )}
                    </button>
                    {actionMenuOpen === `status-${candidate._id}` && (
                      <div className="status-menu">
                        {['New', 'Ongoing', 'Selected', 'Rejected'].map((statusOption) => (
                          <button
                            key={`${candidate._id}-${statusOption}`}
                            onClick={() => handleUpdateStatus(candidate._id, statusOption)}
                            className={candidate.status === statusOption ? 'active' : ''}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td>{candidate.experience || '-'}</td>

            
                <td>
                  <div className="action-container">
                    <button
                      onClick={() => toggleActionMenu(candidate._id)}
                      className="action-button"
                      disabled={deletingCandidateId === candidate._id}
                    >
                      {deletingCandidateId === candidate._id ? 'Deleting...' : <FaEllipsisV />}
                    </button>
                    {actionMenuOpen === candidate._id && (
                      <div className="action-menu">
                        <div>
                          <a
                            href={`http://localhost:8080/api/candidates/${candidate._id}/resume`}
                            download
                          >
                            Download Resume
                          </a>
                          <button
                            onClick={() => handleDeleteCandidate(candidate._id)}
                            className="delete"
                            disabled={deletingCandidateId === candidate._id}
                          >
                            Delete Candidate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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