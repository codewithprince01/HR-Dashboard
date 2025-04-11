import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';
import { fetchAttendance, markAttendance } from '../features/attendanceSlice';
import '../style/pages.css';

const Attendance = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (employee, newStatus) => {
    const todayAttendance = employee.attendance.find(
      (a) => new Date(a.date).toDateString() === new Date().toDateString()
    );
    const na = todayAttendance ? todayAttendance.na : 'NA';
    await dispatch(markAttendance({ id: employee._id, status: newStatus, na }));
  };

  const filteredEmployees = employees.filter((employee) => {
    const todayAttendance = employee.attendance.find(
      (a) => new Date(a.date).toDateString() === new Date().toDateString()
    );
    const currentStatus = todayAttendance ? todayAttendance.status : 'Unmark';

    const matchesStatus =
      statusFilter === 'All' || currentStatus === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case 'Present':
        return 'status-present';
      case 'Unmark':
        return 'status-unmark';
      default:
        return 'status-default';
    }
  };

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="attendance-container">
      {/* Filter & Search */}
      <div className="filters-container">
        <div className="filters-group">
          <div className="select-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select"
            >
              <option value="All">Status</option>
              <option value="Unmark">Unmark</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Work from Home">Work from Home</option>
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

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const todayAttendance = employee.attendance.find(
                (a) => new Date(a.date).toDateString() === new Date().toDateString()
              );
              const currentStatus = todayAttendance ? todayAttendance.status : 'Unmark';
              const currentNA = todayAttendance ? todayAttendance.na : 'NA';

              return (
                <tr key={employee._id}>
                  <td>
                    <img
                      src={employee.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={employee.name}
                      className="profile-image"
                    />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department || 'N/A'}</td>
                  <td>{currentNA || 'N/A'}</td>
                  <td>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(employee, e.target.value)}
                      className={`status-select ${getStatusClass(currentStatus)}`}
                    >
                      <option value="Unmark">Unmark</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Medical Leave">Medical Leave</option>
                      <option value="Work from Home">Work from Home</option>
                    </select>
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
                          {/* Commented out as per original code */}
                          {/* <div>
                            <button>
                              Edit Employee
                            </button>
                            <button>
                              Delete Employee
                            </button>
                          </div> */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;