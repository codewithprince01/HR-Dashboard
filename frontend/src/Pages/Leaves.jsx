import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaEllipsisV } from 'react-icons/fa';

const LeaveManagement = () => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const toggleActionMenu = (id) => {
    setActionMenuOpen(prev => (prev === id ? null : id));
  };

  const leaves = [
    {
      id: 1,
      employee: "Jacob William",
      leaveType: "Sick Leave",
      fromDate: "2025-04-01",
      toDate: "2025-04-03",
      days: 3,
      status: "Pending",
    },
    {
      id: 2,
      employee: "Guy Hawkins",
      leaveType: "Casual Leave",
      fromDate: "2025-04-04",
      toDate: "2025-04-05",
      days: 2,
      status: "Approved",
    },
    {
      id: 3,
      employee: "Arlene McCoy",
      leaveType: "Maternity Leave",
      fromDate: "2025-03-01",
      toDate: "2025-06-01",
      days: 92,
      status: "Rejected",
    },
  ];

  return (
    <div className="">
      {/* Filters and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4d007d] cursor-pointer">
              <option>Status</option>
              <option>Pending</option>
              <option>Approved</option>
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
              placeholder="Search Employee"
              className="pl-10 py-2 pr-4 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#4d007d]"
            />
          </div>
        </div>
      </div>

      {/* Leave Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#4d007d] text-white text-left">
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">From</th>
              <th className="py-3 px-4">To</th>
              <th className="py-3 px-4">No. of Days</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-t border-gray-200">
                <td className="py-4 px-4">{leave.employee}</td>
                <td className="py-4 px-4">{leave.leaveType}</td>
                <td className="py-4 px-4">{leave.fromDate}</td>
                <td className="py-4 px-4">{leave.toDate}</td>
                <td className="py-4 px-4">{leave.days}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="py-4 px-4 relative">
                  <button
                    onClick={() => toggleActionMenu(leave.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaEllipsisV />
                  </button>

                  {actionMenuOpen === leave.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Approve Leave
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Reject Leave
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Delete Request
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-[300px] bg-white shadow-md rounded-lg p-4">
            <div className="bg-[#4D007D] text-white rounded-t-md px-4 py-2 font-semibold">Leave Calendar</div>
            <div className="p-2">
              <div className="flex justify-between items-center mb-2">
                <button>{'<'}</button>
                <div className="text-sm font-semibold">September, 2024</div>
                <button>{'>'}</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs text-center">
                {['S','M','T','W','T','F','S'].map((d) => <div key={d} className="font-bold text-gray-600">{d}</div>)}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`p-1 rounded-full ${i + 1 === 8 ? 'bg-[#4D007D] text-white' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-[#4D007D]">Approved Leaves</h4>
              <div className="flex items-center space-x-3">
                <img src={leaves[0].image} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{leaves[0].name}</div>
                  <div className="text-xs text-gray-500">{leaves[0].date}</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
