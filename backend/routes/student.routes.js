const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const StudentController = require('../controllers/student.controller');

router.get('/dashboard', verifyToken, authorizeRoles([3]), StudentController.getDashboard);
router.get('/dragdrop', verifyToken, authorizeRoles([3]), StudentController.getCompiler);
router.get('/todo', verifyToken, authorizeRoles([3]), StudentController.getTodo);
router.get('/quiz', verifyToken, authorizeRoles([3]), StudentController.getQuiz);
router.get('/archived', verifyToken, authorizeRoles([3]), StudentController.getArchived);
router.get('/setting', verifyToken, authorizeRoles([3]), StudentController.getSetting);

module.exports = router;
