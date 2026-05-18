// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Search route PEHLE honi chahiye
router.get('/search', protect, searchEmployees);

router.route('/')
  .get(protect, getAllEmployees)
  .post(protect, addEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;