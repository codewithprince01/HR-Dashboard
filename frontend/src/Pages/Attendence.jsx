import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';

const Attendence = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statuses, setStatuses] = useState({
    1: 'Present',
    2: 'Present',
    3: 'Absent',
    4: 'Present',
  });

  const toggleActionMenu = (id) => {
    setActionMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (id, newStatus) => {
    setStatuses({ ...statuses, [id]: newStatus });
  };

  const candidates = [
    {
      id: 1,
      name: 'Jane Copper',
      email: 'jane.copper@example.com',
      phone: '(252) 555-0111',
      position: 'Full Time',
      department: 'Designer',
      task: 'Dashboard Home page Alignment',
      profile: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      id: 2,
      name: 'Arlene McCoy',
      email: 'arlene.mccoy@example.com',
      phone: '(302) 555-0107',
      position: 'Full Time',
      department: 'Designer',
      task: 'Dashboard Login page design, Dashboard Home page design',
      profile: 'https://randomuser.me/api/portraits/women/25.jpg',
    },
    {
      id: 3,
      name: 'Cody Fisher',
      email: 'cody.fisher@example.com',
      phone: '(907) 555-0101',
      position: 'Senior',
      department: 'Backend Development',
      task: '--',
      profile: 'https://randomuser.me/api/portraits/men/44.jpg',
    },
    {
      id: 4,
      name: 'Janney Wilson',
      email: 'janney.wilson@example.com',
      phone: '(207) 555-0119',
      position: 'Junior',
      department: 'Backend Development',
      task: 'Dashboard login page integration',
      profile: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: 5,
      name: 'Leslie Alexander',
      email: 'leslie.alexander@example.com',
      phone: '(252) 555-0190',
      position: 'Team Lead',
      department: 'Human Resource',
      task: '4 scheduled interview, Sorting of resumes',
      profile: 'https://randomuser.me/api/portraits/men/50.jpg',
    },
  ];

  return (
    <div className="">
      {/* Filter & Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d007d] cursor-pointer">
              <option>Status</option>
              <option>New</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 py-2 pr-4 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#4d007d]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#4d007d] text-white text-left">
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Task</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t border-gray-200">
                <td className="py-4 px-4">
                  <img
                    src={candidate.profile}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-4 px-4">{candidate.name}</td>
                <td className="py-4 px-4">{candidate.position}</td>
                <td className="py-4 px-4">{candidate.department}</td>
                <td className="py-4 px-4">{candidate.task}</td>
                <td className="py-4 px-4">
                  <select
                    value={statuses[candidate.id] || 'Present'}
                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-sm font-medium focus:outline-none ${
                      statuses[candidate.id] === 'Present'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
                <td className="py-4 px-4 relative">
                  <button
                    onClick={() => toggleActionMenu(candidate.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaEllipsisV />
                  </button>

                  {actionMenuOpen === candidate.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Edit Candidate
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
    </div>
  );
};

export default Attendence;
