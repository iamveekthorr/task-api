import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  @InjectRepository(TasksRepository)
  private tasksRepository: TasksRepository;

  constructor(repository: TasksRepository) {
    this.tasksRepository = repository;
  }

  public async getTaskById(id: string): Promise<Task> {
    const task: Task = await this.tasksRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    // save the task to the Database
    await this.tasksRepository.save(task);
    return task;
  }

  public async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected < 1) {
      throw new NotFoundException(`Task with the id of "${id}" was not found`);
    }
    return;
  }

  public async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  public async getAllTasks(filter: GetTaskFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter);
  }
}
