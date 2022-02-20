import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWTPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(UsersRepository)
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    super({
      secretOrKey: 'testing',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    this.usersRepository = usersRepository;
  }

  public async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.usersRepository.findOne({ username });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
