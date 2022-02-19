import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './auth-credentials.dto';

import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async createUser(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    const { username, password } = authCredentialsDTO;

    const user = this.create({ username, password });

    await this.save(user);
  }
}
