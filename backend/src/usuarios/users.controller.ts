import {Controller,Get,UseGuards,} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)

    @Get('profile')
    async profile(@User() user: any,) {
        return this.usersService.findById(
            user.id,
        );
  }
}