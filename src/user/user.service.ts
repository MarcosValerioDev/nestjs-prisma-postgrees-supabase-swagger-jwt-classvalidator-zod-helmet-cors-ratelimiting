import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll() {
    const users = await this.prismaService.user.findMany();
    if (users.length === 0) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    
    return users;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where:{
        id: id
      }
    })

    if (!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);            
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id
      }
    });
    
    
    if (!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);            
    }



    const userUpdate = await this.prismaService.user.update({
      where: {
        id: id
      },
      data: {
        ...updateUserDto
      }
    });
    return userUpdate;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id
      }
    });

    if (!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);            
    }

    await this.prismaService.user.delete({
      where: {
        id: id
      }
    });

    return user;
  }
}
