const HR = require("../models/candidate/hr.model");
const fs = require("fs");
const path = require("path");

const handleFileUpload = (file, folder) => {
  if (!file) return null;

  const uploadDir = path.join(__dirname, "../uploads", folder);
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
      ? handleFileUpload(req.files.resume[0], "resumes")
      : null;

    const candidate = new HR({
      name,
      email,
      phone,
      position,
      experience,
      resume: resumePath,
      declaration: declaration === "true",
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      data: candidate,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const { status, position, search } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (position && position !== "All") query.position = position;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    const candidates = await HR.find(query)
      .sort({ createdAt: -1 })
      .select("-__v -createdAt -updatedAt");
    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching candidates",
    });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Ongoing", "Selected", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
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
        message: "Candidate not found",
      });
    }

    if (status === "Selected") {
      candidate.isEmployee = true;
      candidate.dateOfJoining = new Date();
      await candidate.save();
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(400).json({
      success: false,
      message: err.message.includes("Cast to ObjectId failed")
        ? "Invalid candidate ID"
        : err.message,
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
        message: "Candidate not found",
      });
    }
    res.status(200).json({
      success: true,
      data: { id },
    });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    res.status(400).json({
      success: false,
      message: err.message.includes("Cast to ObjectId failed")
        ? "Invalid candidate ID"
        : err.message,
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
        message: "Resume not found",
      });
    }

    const filePath = path.join(__dirname, "..", candidate.resume);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Employee Operations
exports.getAllEmployees = async (req, res) => {
  try {
    const { position, department, search } = req.query;
    const query = { isEmployee: true };

    if (position && position !== "All") query.position = position;
    if (department && department !== "All") query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await HR.find(query)
      .sort({ dateOfJoining: -1 })
      .select("-__v -createdAt -updatedAt");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching employees",
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file?.profileImage) {
      updates.profileImage = handleFileUpload(req.file.profileImage[0], "profiles");
    }

    const employee = await HR.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await HR.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
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
        message: "Only employees can have attendance records",
      });
    }

    // Check if attendance already marked for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = employee.attendance.find(
      (a) =>
        a.date >= today && a.date < new Date(today.getTime() + 86400000)
    );

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.task = task;
    } else {
      employee.attendance.push({
        status,
        task,
      });
    }

    await employee.save();

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date, status, search } = req.query;
    const query = { isEmployee: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    let employees = await HR.find(query).sort({ srNo: 1 });

    // Filter by attendance status if provided
    if (status || date) {
      const filterDate = date ? new Date(date) : new Date();
      filterDate.setHours(0, 0, 0, 0);

      employees = employees.filter((emp) => {
        const attendanceRecord = emp.attendance.find(
          (a) =>
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
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await HR.find({ isEmployee: true }).select("name position attendance _id");
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const employees = await HR.find({ isEmployee: true }).select("leaves");
    let allLeaves = employees
      .flatMap((emp) => emp.leaves || [])
      .filter((leave) => leave !== null && leave !== undefined);

    if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
      allLeaves = allLeaves.filter((leave) => leave.status === status);
    }

    res.status(200).json({ success: true, data: allLeaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addLeave = async (req, res) => {
  try {
    console.log("Raw req.body:", req.body);
    console.log("Raw req.files:", req.files);

    const { employeeId, designation, leaveDate, reason } = req.body;
    if (!employeeId || !designation || !leaveDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: " + JSON.stringify({ employeeId, designation, leaveDate, reason }),
      });
    }

    const employee = await HR.findById(employeeId);
    if (!employee || !employee.isEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found or not an employee" });
    }

    const isPresent = employee.attendance.some(
      (a) =>
        a.status === "Present" &&
        new Date(a.date).toDateString() === new Date().toDateString()
    );
    if (!isPresent) {
      return res
        .status(400)
        .json({ success: false, message: "Employee must be present to apply for leave" });
    }

    let documentsPath = null;
    if (req.files && req.files.length > 0) {
      const file = req.files.find((f) => f.fieldname === "documents");
      if (file) {
        documentsPath = handleFileUpload(file, "leaves");
      }
    }

    const newLeave = {
      designation,
      leaveDate: new Date(leaveDate),
      documents: documentsPath,
      reason,
      status: "Pending", // Default to Pending since no frontend input
    };

    employee.leaves.push(newLeave);
    await employee.save();

    res.status(201).json({ success: true, data: newLeave });
  } catch (error) {
    console.error("Error in addLeave:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Use Pending, Approved, or Rejected.",
      });
    }

    const employee = await HR.findOne({ "leaves._id": id, isEmployee: true });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Leave not found or employee not authorized",
      });
    }

    const leave = employee.leaves.id(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = status;
    await employee.save();

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadLeaveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await HR.findOne({ "leaves._id": id, isEmployee: true });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee or leave not found",
      });
    }

    const leave = employee.leaves.id(id);
    if (!leave || !leave.documents) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const filePath = path.join(__dirname, "..", leave.documents);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
