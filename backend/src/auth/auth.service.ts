import {Injectable,BadRequestException,UnauthorizedException,} from '@nestjs/common';
import { UsersService } from '../usuarios/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existe = await this.usersService.findByEmail(dto.email);
        if (existe) { throw new BadRequestException('El correo ya existe');}

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword,
        });

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            token,
            user,
        };
    }

    async login(dto: LoginDto) {
        const user =await this.usersService.findByEmail(dto.email);
        if (!user) {throw new UnauthorizedException('Credenciales inválidas');}

        const valid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!valid) {throw new UnauthorizedException('Credenciales inválidas',);}
        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            token,
            user,
        };
    }
}