import {Body,Controller,Post,Req, UseGuards, UploadedFile,UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PublicacionDto } from './dto/publicacion.dto';
import { PublicacionesService } from './publicaciones.service';
import { Request } from 'express';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.publicacionesService.uploadImage(file);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() dto: PublicacionDto,
        @Req() req: Request & { user: any },
    ) {
        
        console.log("REQ USER:", req.user);

        return this.publicacionesService.create(
        dto,
        req.user,
        );
    }
}