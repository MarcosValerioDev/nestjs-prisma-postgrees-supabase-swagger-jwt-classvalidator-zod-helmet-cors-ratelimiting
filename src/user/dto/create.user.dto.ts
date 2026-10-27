import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3,{ 'message': 'Name deve ter no mínimo 3 characteres' })
    @MaxLength(10,{ 'message': 'Name deve ter no máximo 10 characteres' })
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6,{ 'message': 'Password deve ter no mínimo 6 characteres' })
    @MaxLength(20,{ 'message': 'Password deve ter no máximo 20 characteres' })
    @IsNotEmpty()
    password: string;
}


