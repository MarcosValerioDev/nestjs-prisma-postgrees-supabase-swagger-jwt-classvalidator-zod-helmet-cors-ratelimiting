import { Body, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import jwtConfig from './config/jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import { SignInDto } from './dto/signin.dto.js';
import { AbstractHashService } from './authservice/AbstractHashService.js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly  hashservice: AbstractHashService,
        @Inject(jwtConfig.KEY) 
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}

    async authenticate(signInDto: SignInDto){
        const { email, password } = signInDto;
        const user = await this.prisma.user.findFirst({
            where:{
                email: email
            }
        })
        
        if (!user) {
            throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
        }


        const isPasswordValid = await this.hashservice.verify(signInDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new HttpException("Senha inválida", HttpStatus.UNAUTHORIZED);
        }


        const token = this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        },{
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.ttl,
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
        })
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: await token
        }

    }

}
