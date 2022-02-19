import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
