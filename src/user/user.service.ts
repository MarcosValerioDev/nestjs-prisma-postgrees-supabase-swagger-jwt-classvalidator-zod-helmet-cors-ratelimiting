import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto.js';
import { UpdateUserDto } from './dto/update.user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AbstractHashService } from '../auth/authservice/AbstractHashService.js';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: AbstractHashService
  ){}
  
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashService.hash(createUserDto.password);
    const user = await this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: hashedPassword,
      },
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
