const taskService = require('../services/taskService');
const { successResponse } = require('../utils/response');

async function createTask(req, res, next) {
  try {
    const payload = req.validated || req.body;
    const task = await taskService.create(req.user.id, payload);
    return res.status(201).json(successResponse('Task created', task));
  } catch (err) {
    return next(err);
  }
}

async function listTasks(req, res, next) {
  try {
    const {
      page, limit, status, priority, sortBy, order,
    } = req.query;
    const result = await taskService.list(req.user.id, {
      page, limit, status, priority, sortBy, order,
    });
    return res.json(successResponse('Tasks retrieved', result));
  } catch (err) {
    return next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskService.getById(req.user.id, id);
    return res.json(successResponse('Task retrieved', task));
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.validated || req.body;
    const task = await taskService.update(req.user.id, id, payload);
    return res.json(successResponse('Task updated', task));
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    await taskService.remove(req.user.id, id);
    return res.json(successResponse('Task deleted', null));
  } catch (err) {
    return next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.validated || req.body;
    const task = await taskService.patchStatus(req.user.id, id, status);
    return res.json(successResponse('Task status updated', task));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createTask, listTasks, getTask, updateTask, deleteTask, patchStatus,
};
