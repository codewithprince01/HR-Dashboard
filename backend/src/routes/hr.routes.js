const express = require('express');
const router = express.Router();
const HRController = require('../controllers/hr.controller');
const upload = require('../config/multer');
const { addCandidate, getAllCandidates, updateCandidateStatus, downloadResume } = require('../controllers/hr.controller');


// Candidate routes
router.post('/candidates', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), addCandidate);

router.get('/candidates',getAllCandidates);
router.patch('/candidates/:id/status', updateCandidateStatus);
router.get('/candidates/:id/resume',downloadResume);

// Employee routes
router.get('/employees', HRController.getAllEmployees);
router.put('/employees/:id', upload.single('profileImage'), HRController.updateEmployee);
router.delete('/employees/:id', HRController.deleteEmployee);

// Attendance routes
router.post('/attendance/:id', HRController.markAttendance);
router.get('/attendance', HRController.getAttendance);

module.exports = router;