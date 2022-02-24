import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  @InjectRepository(TasksRepository)
  private tasksRepository: TasksRepository;

  constructor(repository: TasksRepository) {
    this.tasksRepository = repository;
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const task: Task = await this.tasksRepository.findOne({ id, user });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  public async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected < 1) {
      throw new NotFoundException(`Task with the id of "${id}" was not found`);
    }
    return;
  }

  public async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  public async getAllTasks(
    filter: GetTaskFilterDTO,
    user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter, user);
  }
}
