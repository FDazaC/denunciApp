import {Body,Controller,Get,Post,Patch,Delete,Req,
        UseGuards,UploadedFile,UseInterceptors,ParseIntPipe,Param,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PublicacionDto } from './dto/publicacion.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PublicacionesService } from './publicaciones.service';
import {ApiBearerAuth,ApiBody,ApiExcludeEndpoint,ApiOperation,ApiTags} from '@nestjs/swagger';

@ApiTags('Publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
    ) {}

    @ApiOperation({
        summary: 'Obtener todas las publicaciones',
    })
    @Get()
    findAll() {
        return this.publicacionesService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obtener reportes del usuario autenticado',
    })
    @UseGuards(JwtAuthGuard)
    @Get('mis-reportes')
    misReportes(
        @Req() req: Request & { user: any },
    ) {
        return this.publicacionesService.misReportes(
            req.user.sub,
        );
    }

    @ApiOperation({
        summary: 'Obtener una publicación por ID',
    })
    @Get(':id')
    findById(
        @Param('id', ParseIntPipe) id: string,
    ) {
        return this.publicacionesService.findOne(
            Number(id),
        );
    }

    @ApiExcludeEndpoint()
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: any,
    ) {
        return this.publicacionesService.uploadImage(
            file,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Crear una publicación',
    })
    @ApiBody({
        type: PublicacionDto,
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() dto: PublicacionDto,
        @Req() req: Request & { user: any },
    ) {
        return this.publicacionesService.create(
            dto,
            req.user,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Editar una publicación',
    })
    @ApiBody({
        type: PublicacionDto,
    })
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: PublicacionDto,
        @Req() req: Request & { user: any },
    ) {
        return this.publicacionesService.update(
            Number(id),
            dto,
            req.user,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Eliminar una publicación',
    })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Req() req: Request & { user: any },
    ) {
        return this.publicacionesService.remove(
            Number(id),
            req.user,
        );
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Actualizar estado de una publicación (solo admin)',
    })
    @ApiBody({
        type: UpdateEstadoDto,
    })
    @UseGuards(JwtAuthGuard)
    @Patch(':id/estado')
    updateEstado(
        @Param('id') id: string,
        @Body() dto: UpdateEstadoDto,
        @Req() req: Request & { user: any },
    ) {
        return this.publicacionesService.updateEstado(
            Number(id),
            dto.estado,
            req.user,
        );
    }
}