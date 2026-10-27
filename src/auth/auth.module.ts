import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { ConcreteHashService } from './authservice/ConcretHashService.js';
import { AbstractHashService } from './authservice/AbstractHashService.js';
import { AuthController } from './auth.controller.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import jwtConfig from './config/jwt.config.js';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [PrismaModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  providers: [{
    provide: AbstractHashService,
    useClass: ConcreteHashService
  }, 
  AuthService],
  exports: [AbstractHashService, JwtModule, ConfigModule],
  controllers: [AuthController],
})
export class AuthModule {}
