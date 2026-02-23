import prisma from '../../config/prisma';

export class TaskService {
  async createTask(data: any, userId: string) {
    return prisma.task.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async getTasks(userId: string, role: string) {
    // Admins can see all tasks, users see their own
    if (role === 'ADMIN') {
      return prisma.task.findMany({ include: { user: { select: { name: true, email: true } } } });
    }
    return prisma.task.findMany({ where: { createdBy: userId } });
  }

  async getTaskById(taskId: string, userId: string, role: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new Error('Task not found');
    }

    if (role !== 'ADMIN' && task.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return task;
  }

  async updateTask(taskId: string, data: any, userId: string, role: string) {
    // Verify existence and authorization first
    await this.getTaskById(taskId, userId, role);

    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteTask(taskId: string, userId: string, role: string) {
    await this.getTaskById(taskId, userId, role);

    return prisma.task.delete({ where: { id: taskId } });
  }
}

export const taskService = new TaskService();
