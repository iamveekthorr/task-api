import { TaskStatus } from '../tasks.model';

export class GetTaskFilterDTO {
  status?: TaskStatus;
  search?: string;
}
