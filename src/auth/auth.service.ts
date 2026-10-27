import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginInput } from './auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.users.create(dto);
    return { user, accessToken: await this.sign(user.id, user.email) };
  }

  async login({ email, password }: LoginInput) {
    const user = await this.users.findByEmail(email);
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { accessToken: await this.sign(user.id, user.email) };
  }

  private sign(sub: string, email: string) {
    return this.jwt.signAsync({ sub, email });
  }
}
