import {Controller,Get,UseGuards} from '@nestjs/common';
import {ApiBearerAuth,ApiOperation,ApiTags} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UsersService } from './users.service';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obtener perfil del usuario autenticado',
    })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(
        @User() user: any,
    ) {
        return this.usersService.findById(
            user.id,
        );
    }
}