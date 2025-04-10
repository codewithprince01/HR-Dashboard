const HR = require('../models/candidate/hr.model');
const fs = require('fs');
const path = require('path');


const handleFileUpload = (file, folder) => {
  if (!file) return null;
  
  const uploadDir = path.join(__dirname, '../uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);
  
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${folder}/${fileName}`;
};


exports.addCandidate = async (req, res) => {
  try {
    const { name, email, phone, position, experience, declaration } = req.body;

    const resumePath = req.files?.resume 
      ? handleFileUpload(req.files.resume[0], 'resumes') 
      : null;
    
    const candidate = new HR({
      name,
      email,
      phone,
      position,
      experience,
      resume: resumePath,
      declaration: declaration === 'true'
    });
    
    await candidate.save();
    
    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAllCandidates = async (req, res) => {
    try {
      const { status, position, search } = req.query;
      const query = { isEmployee: false };
      
      if (status && status !== 'All') query.status = status;
      if (position && position !== 'All') query.position = position;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }
      
      const candidates = await HR.find(query)
        .sort({ createdAt: -1 })
        .select('-__v -createdAt -updatedAt');
      
      res.status(200).json({
        success: true,
        count: candidates.length,
        data: candidates
      });
    } catch (err) {
      console.error('Error fetching candidates:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching candidates'
      });
    }
  };

  exports.updateCandidateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['New', 'Ongoing', 'Selected', 'Rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
  
      const candidate = await HR.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }
  
      if (status === 'Selected') {
        candidate.isEmployee = true;
        candidate.dateOfJoining = new Date();
        await candidate.save();
      }
      
      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (err) {
      console.error('Error updating status:', err);
      res.status(400).json({
        success: false,
        message: err.message.includes('Cast to ObjectId failed') 
          ? 'Invalid candidate ID' 
          : err.message
      });
    }
  };

  exports.deleteCandidate = async (req, res) => {
    try {
      const { id } = req.params;
      
      const candidate = await HR.findByIdAndDelete(id);
      
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: { id }
      });
    } catch (err) {
      console.error('Error deleting candidate:', err);
      res.status(400).json({
        success: false,
        message: err.message.includes('Cast to ObjectId failed') 
          ? 'Invalid candidate ID' 
          : err.message
      });
    }
  };


exports.downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await HR.findById(id);
    
    if (!candidate || !candidate.resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    const filePath = path.join(__dirname, '..', candidate.resume);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Employee Operations
exports.getAllEmployees = async (req, res) => {
  try {
    const { position, department, search } = req.query;
    const query = { isEmployee: true };
    
    if (position) query.position = position;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await HR.find(query).sort({ srNo: 1 });
    
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (req.files?.profileImage) {
      updates.profileImage = handleFileUpload(req.files.profileImage[0], 'profiles');
    }
    
    const employee = await HR.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await HR.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Attendance Operations
exports.markAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, task } = req.body;
    
    const employee = await HR.findById(id);
    
    if (!employee.isEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Only employees can have attendance records'
      });
    }
    
    // Check if attendance already marked for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = employee.attendance.find(a => 
      a.date >= today && a.date < new Date(today.getTime() + 86400000)
    );
    
    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.task = task;
    } else {
      employee.attendance.push({
        status,
        task
      });
    }
    
    await employee.save();
    
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date, status, search } = req.query;
    const query = { isEmployee: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    let employees = await HR.find(query).sort({ srNo: 1 });
    
    // Filter by attendance status if provided
    if (status || date) {
      const filterDate = date ? new Date(date) : new Date();
      filterDate.setHours(0, 0, 0, 0);
      
      employees = employees.filter(emp => {
        const attendanceRecord = emp.attendance.find(a => 
          a.date >= filterDate && a.date < new Date(filterDate.getTime() + 86400000)
        );
        
        if (status) {
          return attendanceRecord && attendanceRecord.status === status;
        }
        return !!attendanceRecord;
      });
    }
    
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};