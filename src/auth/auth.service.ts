import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthCredentialsDTO } from './auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  @InjectRepository(UsersRepository)
  private usersRepository: UsersRepository;

  private jwtService: JwtService;

  constructor(repository: UsersRepository, jwtService: JwtService) {
    this.usersRepository = repository;
    this.jwtService = jwtService;
  }

  public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDTO);
  }

  public async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ token: string }> {
    const { username, password } = authCredentialsDTO;

    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const token = await this.jwtService.signAsync(payload);
      return { token };
    }

    throw new UnauthorizedException('invalid login credentials');
  }
}
