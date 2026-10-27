import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignInDto } from './dto/signin.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post()
    async authenticate(@Body() signInDto: SignInDto) {
        return this.authService.authenticate(signInDto);
    }
}
