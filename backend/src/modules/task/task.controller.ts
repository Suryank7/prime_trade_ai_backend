import { Request, Response, NextFunction } from 'express';
import { taskService } from './task.service';
import { createTaskSchema, updateTaskSchema } from './task.validation';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const task = await taskService.createTask(value, req.user!.id);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getTasks(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!.id, req.user!.role);
    res.status(200).json({ success: true, task });
  } catch (error: any) {
    if (error.message === 'Task not found') return res.status(404).json({ success: false, message: 'Task not found' });
    if (error.message === 'Unauthorized') return res.status(403).json({ success: false, message: 'Not authorized to access this task' });
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const task = await taskService.updateTask(req.params.id, value, req.user!.id, req.user!.role);
    res.status(200).json({ success: true, task });
  } catch (error: any) {
    if (error.message === 'Task not found') return res.status(404).json({ success: false, message: 'Task not found' });
    if (error.message === 'Unauthorized') return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.params.id, req.user!.id, req.user!.role);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Task not found') return res.status(404).json({ success: false, message: 'Task not found' });
    if (error.message === 'Unauthorized') return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    next(error);
  }
};
