import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDTO } from './auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async createUser(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<void> {
    const { username, password } = authCredentialsDTO;

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('This user already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
