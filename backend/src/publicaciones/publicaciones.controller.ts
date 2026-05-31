import {Body,Controller,Get,Post,Patch,Delete, Req, UseGuards, UploadedFile,UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PublicacionDto } from './dto/publicacion.dto';
import { PublicacionesService } from './publicaciones.service';
import { Request } from 'express';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
    ) {}

    @Get()
    findAll() {
        return this.publicacionesService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.publicacionesService.findOne(Number(id));
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: any,
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

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: PublicacionDto,
        @Req() req: Request & { user: any },
    ){
        return this.publicacionesService.update(Number(id), dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id:string, @Req() req: Request & { user: any },){
        return this.publicacionesService.remove(Number(id), req.user);
    }

}