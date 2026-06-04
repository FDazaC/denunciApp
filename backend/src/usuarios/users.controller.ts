import {Controller,Get,UseGuards} from '@nestjs/common';
import { ApiBody, ApiBearerAuth,ApiOperation,ApiTags, ApiOkResponse} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UsersService } from './users.service';
import { Body, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

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
    @ApiOkResponse({
        description: 'Perfil obtenido correctamente',
    })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(
        @User() user: any,
    ) {
        return this.usersService.findById(
            user.sub,
        );
    }


    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Actualizar perfil del usuario autenticado',
    })
    @ApiBody({
        type: UpdateUserDto,
    })
    @ApiOkResponse({
        description: 'Perfil actualizado correctamente',
    })
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(
        @User() user: any,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(
            user.sub,
            dto,
        );
    }
}