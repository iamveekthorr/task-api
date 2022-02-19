import { EntityRepository, Repository } from 'typeorm';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  public async getTasks(filterDto: GetTaskFilterDTO): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const task = await query.getMany();
    return task;
  }
}
