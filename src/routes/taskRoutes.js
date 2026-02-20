const express = require('express');
const taskController = require('../controllers/taskController');
const { jwtMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema, patchStatusSchema } = require('../validation/schemas');

const router = express.Router();

router.use(jwtMiddleware);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/status', validate(patchStatusSchema), taskController.patchStatus);

module.exports = router;
