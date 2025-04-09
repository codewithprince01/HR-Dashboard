import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleActionMenu = (id) => {
    setActionMenuOpen(prev => (prev === id ? null : id));
  };

  const candidates = [
    {
      id: 1,
      name: "Jacob William",
      email: "jacob.william@example.com",
      phone: "(252) 555-0111",
      position: "Senior Developer",
      department: "Engineering",
      dateOfJoining: "2023-08-01",
      profile: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Guy Hawkins",
      email: "kenzi.lawson@example.com",
      phone: "(907) 555-0101",
      position: "HR Manager",
      department: "Human Resources",
      dateOfJoining: "2023-09-15",
      profile: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      id: 3,
      name: "Arlene McCoy",
      email: "arlene.mccoy@example.com",
      phone: "(302) 555-0107",
      position: "UI/UX Designer",
      department: "Design",
      dateOfJoining: "2023-06-10",
      profile: "https://randomuser.me/api/portraits/women/25.jpg"
    },
    {
      id: 4,
      name: "Leslie Alexander",
      email: "willie.jennings@example.com",
      phone: "(207) 555-0119",
      position: "Frontend Developer",
      department: "Engineering",
      dateOfJoining: "2022-11-25",
      profile: "https://randomuser.me/api/portraits/women/68.jpg"
    },
  ];

  return (
    <div className="">
      {/* Filters and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d007d] cursor-pointer">
              <option>Position</option>
              <option>Senior Developer</option>
              <option>HR Manager</option>
              <option>UI/UX Designer</option>
              <option>Frontend Developer</option>
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

      {/* Candidates Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#4d007d] text-white text-left">
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Candidates Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Date of Joining</th>
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
                <td className="py-4 px-4">{candidate.email}</td>
                <td className="py-4 px-4">{candidate.phone}</td>
                <td className="py-4 px-4">{candidate.position}</td>
                <td className="py-4 px-4">{candidate.department}</td>
                <td className="py-4 px-4">{candidate.dateOfJoining}</td>
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

export default Employees;
