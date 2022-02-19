import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  @InjectRepository(UsersRepository)
  private usersRepository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.usersRepository = repository;
  }

  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDTO);
  }
}
