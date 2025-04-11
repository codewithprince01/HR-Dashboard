import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaFileDownload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaves } from "../features/leaveSlice";
import { fetchEmployees } from "../features/employeeSlice";
import AddLeaves from "./AddLeaves";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from 'date-fns';
import '../style/pages.css';



const Leaves = () => {
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const dispatch = useDispatch();
  const { leaves, status: leaveStatus, error: leaveError } = useSelector(
    (state) => state.leaves
  );
  const { employees, status: empStatus, error: empError } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    dispatch(fetchLeaves());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const toggleStatusDropdown = (id) => {
    setStatusDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (e, leaveId, currentStatus) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus) {
      try {
        await axios.patch(`http://localhost:8080/api/leaves/${leaveId}`, {
          status: newStatus,
        });
        dispatch(fetchLeaves());
        setStatusDropdownOpen(null);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    } else {
      setStatusDropdownOpen(null);
    }
  };

  const handleDownloadDocument = async (leave) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/leaves/${leave._id}/document`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        leave.documents?.split("/").pop() || "document.pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
    }
  };

  const handleAddLeaveClick = () => {
    console.log("Add Leave button clicked");
    setIsAddLeaveOpen(true);
  };

  const handleCloseAddLeave = () => {
    console.log("Closing Add Leave modal");
    setIsAddLeaveOpen(false);
  };

  const filteredLeaves = leaves
    .filter((leave) => leave !== null && leave !== undefined)
    .filter((leave) => {
      const employee = employees.find((emp) =>
        emp.leaves.some((l) => l._id === leave._id)
      );
      const matchesSearch = employee
        ? employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesStatus =
        statusFilter === "All" || leave.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const approvedLeavesList = filteredLeaves
    .filter((leave) => leave.status === "Approved")
    .map((leave) => {
      const employee = employees.find((emp) =>
        emp.leaves.some((l) => l._id === leave._id)
      );
      return { ...leave, employee };
    });

  const approvedLeavesForCalendar = approvedLeavesList.map((leave) => ({
    date: leave.leaveDate ? format(new Date(leave.leaveDate), 'yyyy-MM-dd') : null,
  }));

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasApprovedLeave = approvedLeavesForCalendar.some(
        (leave) => leave.date === dateStr
      );
      return hasApprovedLeave ? <div className="dot"></div> : null;
    }
    return null;
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const leaveOnDate = approvedLeavesList.find(
      (leave) => leave.leaveDate && format(new Date(leave.leaveDate), 'yyyy-MM-dd') === dateStr
    );
    setSelectedDate(leaveOnDate || null);
  };

  if (leaveStatus === "loading" || empStatus === "loading")
    return <div className="loading">Loading...</div>;
  if (leaveStatus === "failed") return <div className="error">Error: {leaveError}</div>;
  if (empStatus === "failed") return <div className="error">Error: {empError}</div>;

  return (
    <div className="leaves-container">
      <div className="filters-container">
        <div className="select-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select"
          >
            <option value="All">Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <FaChevronDown className="chevron-icon" />
        </div>
        <div className="search-container">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={handleAddLeaveClick}
            className="add-button  px-6 py-2"
          >
            Add Leave
          </button>
        </div>
      </div>
      <div className="main-layout">
    
        <div className="left-section">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Docs</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => {
                  const employee = employees.find((emp) =>
                    emp.leaves.some((l) => l._id === leave._id)
                  );
                  return (
                    <tr key={leave._id}>
                      <td>
                        {employee?.profileImage ? (
                          <img
                            src={employee.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt="Profile"
                            className="profile-image"
                          />
                        ) : (
                          <div className="profile-placeholder">
                            <img
                              src='https://randomuser.me/api/portraits/men/32.jpg'
                              alt="Profile"
                              className="profile-image"
                            />
                          </div>
                        )}
                      </td>
                      <td>{employee ? employee.name : "N/A"}</td>
                      <td>
                        {leave.leaveDate
                          ? format(new Date(leave.leaveDate), 'dd/MM/yyyy')
                          : "N/A"}
                      </td>
                      <td>{leave.reason || "N/A"}</td>
                      <td>
                        {statusDropdownOpen === leave._id ? (
                          <select
                            value={leave.status}
                            onChange={(e) =>
                              handleStatusChange(e, leave._id, leave.status)
                            }
                            onBlur={() => setStatusDropdownOpen(null)}
                            className="status-select"
                            autoFocus
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span
                            className={`status-span ${leave.status === "Approved" ? "status-approved" : leave.status === "Pending" ? "status-pending" : "status-rejected"}`}
                            onClick={() => toggleStatusDropdown(leave._id)}
                          >
                            {leave.status || "N/A"}
                          </span>
                        )}
                      </td>
                      <td>
                        {leave.documents && (
                          <button
                            onClick={() => handleDownloadDocument(leave)}
                            className="download-button"
                          >
                            <FaFileDownload />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

    
        <div className="right-section">
       
          <div className="calendar-container">
            <div className="calendar-header">
              <h2>Leave Calendar</h2>
            </div>
            <div className="calendar-content">
              <Calendar
                onClickDay={handleDateClick}
                tileContent={tileContent}
                value={new Date()}
                className="react-calendar"
              />
              {selectedDate && selectedDate.employee && (
                <div className="leave-details">
                  <h3>Approved Leave</h3>
                  <div className="leave-details-content">
                    {selectedDate.employee?.profileImage ? (
                      <img
                        src={selectedDate.employee.profileImage}
                        alt="Profile"
                        className="leave-details-image"
                      />
                    ) : (
                      <div className="leave-details-placeholder"></div>
                    )}
                    <div className="leave-details-info">
                      <p className="name">{selectedDate.employee.name}</p>
                      <p className="date">
                        {selectedDate.leaveDate
                          ? format(new Date(selectedDate.leaveDate), 'dd/MM/yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        
          <div className="approved-leaves-container">
            <h2>Approved Leaves</h2>
            {approvedLeavesList.length > 0 ? (
              approvedLeavesList.map((leave) => (
                <div key={leave._id} className="approved-leave-item">
                  {leave.employee?.profileImage ? (
                    <img
                      src={leave.employee.profileImage}
                      alt="Profile"
                      className="approved-leave-image"
                    />
                  ) : (
                    <div className="approved-leave-placeholder">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Profile"
                        className="approved-leave-image"
                      />
                    </div>
                  )}
                  <div className="approved-leave-info">
                    <p className="name">{leave.employee?.name}</p>
                    <p className="date">
                      {leave.leaveDate
                        ? format(new Date(leave.leaveDate), 'dd/MM/yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-leaves">No approved leaves.</p>
            )}
          </div>
        </div>
      </div>


      {isAddLeaveOpen && (
        <AddLeaves
          isOpen={isAddLeaveOpen}
          onClose={handleCloseAddLeave}
          employees={employees}
        />
      )}
    </div>
  );
};

export default Leaves;