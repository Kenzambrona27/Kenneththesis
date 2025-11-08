const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const InstructorController = require('../controllers/instructor.controller');

router.get('/dashboard', verifyToken, authorizeRoles([2]), InstructorController.getDashboard);
router.get('/content_management', verifyToken, authorizeRoles([2]), InstructorController.getContentManagement);
router.get('/dragdropactivity', verifyToken, authorizeRoles([2]), InstructorController.getDragDropActivity);
router.get('/compiler', verifyToken, authorizeRoles([2]), InstructorController.getCompiler);

module.exports = router;


