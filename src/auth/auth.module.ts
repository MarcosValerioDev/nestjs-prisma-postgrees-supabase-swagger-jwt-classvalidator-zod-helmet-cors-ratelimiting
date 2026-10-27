import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ConcreteHashService } from './authservice/ConcretHashService.js';
import { AbstractHashService } from './authservice/AbstractHashService.js';
import { AuthController } from './auth.controller.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';

@Global()
@Module({
  imports: [PrismaModule],

  providers: [{
    provide: AbstractHashService,
    useClass: ConcreteHashService
  }, 
  AuthService],
  exports: [AbstractHashService],
  controllers: [AuthController],
})
export class AuthModule {}
