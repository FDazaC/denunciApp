import {Controller,Post,Body} from '@nestjs/common';
import {ApiTags,ApiOperation,ApiBody,ApiOkResponse} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @ApiOperation({summary: 'Registrar un nuevo usuario',})
    @ApiBody({type: RegisterDto})
    @ApiOkResponse({description: 'Usuario registrado correctamente'})
    @Post('register')
    register(
        @Body() dto: RegisterDto,
    ) {
        return this.authService.register(dto);
    }

    @ApiOperation({
        summary: 'Iniciar sesión',
    })
    @ApiBody({
        type: LoginDto,
    })
    @ApiOkResponse({description: 'Usuario logeadocorrectamente'})
    @Post('login')
    login(
        @Body() dto: LoginDto,
    ) {
        return this.authService.login(dto);
    }
}