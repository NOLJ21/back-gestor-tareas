const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.use(verifyToken); // proteger todas las rutas

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/by-date', taskController.getTasksByDate);
router.get('/by-title', taskController.getTaskByTitle);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);


module.exports = router;
