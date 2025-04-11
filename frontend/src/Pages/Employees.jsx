import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';
import EditEmployee from './EditEmployee';
import '../style/pages.css';
import { fetchEmployees,deleteEmployee } from '../features/employeeSlice';

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [positionFilter, setPositionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        setActionMenuOpen(null);
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesPosition =
      positionFilter === 'All' || employee.position === positionFilter;
    const matchesSearch =
      searchTerm === '' ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="employees-container">
      <div className="filters-container">
        <div className="filters-group">
          <div className="select-container">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="select"
            >
              <option value="All">Position</option>
              <option value="Intern">Intern</option>
              <option value="Full Time">Full Time</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Team Lead">Team Lead</option>
            </select>
            <FaChevronDown className="chevron-icon" />
          </div>
        </div>
        <div className="search-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <img
                    src={employee.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={employee.name}
                    className="profile-image"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.department || 'N/A'}</td>
                <td>
                  {new Date(employee.dateOfJoining).toLocaleDateString()}
                </td>
                <td>
                  <div className="action-container">
                    <button
                      onClick={() => toggleActionMenu(employee._id)}
                      className="action-button"
                    >
                      <FaEllipsisV />
                    </button>
                    {actionMenuOpen === employee._id && (
                      <div className="action-menu">
                        <div>
                          <button
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit Employee
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee._id)}
                          >
                            Delete Employee
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

      <EditEmployee
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default Employees;