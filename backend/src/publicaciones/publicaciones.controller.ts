import {Body,Controller,Get,Post,Patch,Delete,Req,
        UseGuards,UploadedFile,UseInterceptors,ParseIntPipe,Param,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PublicacionDto } from './dto/publicacion.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { PublicacionesService } from './publicaciones.service';
import {ApiBearerAuth,ApiBody,ApiExcludeEndpoint,ApiOperation,ApiTags,ApiOkResponse,ApiNotFoundResponse,
    ApiCreatedResponse,ApiBadRequestResponse,ApiForbiddenResponse,ApiUnauthorizedResponse
} from '@nestjs/swagger';

@ApiTags('Publicaciones')
@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
    ) {}

    @ApiOperation({summary: 'Obtener todas las publicaciones'})
    @Get()
    findAll() {
        return this.publicacionesService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({summary: 'Obtener reportes del usuario autenticado'})
    @ApiOkResponse({description: 'Reportes obtenidos correctamente',})
    @ApiUnauthorizedResponse({ 
        description: 'Token inválido o no enviado',
        schema: {
            example: {
                statusCode: 401,
                message: 'Unauthorized',
            },
        },
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

    @ApiOperation({summary: 'Obtener un reporte por ID'})
    @ApiOkResponse({description: 'Reporte obtenido correctamente',})
    @ApiNotFoundResponse({
        description: 'Reporte no encontrado',
        schema: {
            example: {
                statusCode: 404,
                message: 'Reporte no encontrado',
                error: 'Not Found',
            },
        },
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
    @ApiOperation({summary: 'Crear un reporte',})
    @ApiBody({type: PublicacionDto,})
    @ApiCreatedResponse({ description: 'Reporte creado correctamente' })
    @ApiBadRequestResponse({ 
        description: 'Datos inválidos',
        schema: {
            example: {
                statusCode: 400,
                message: ['titulo no puede estar vacio'],
                error: 'Bad Request',
            },
        },
    })
    @ApiUnauthorizedResponse({ description: 'No autenticado' })
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
    @ApiOperation({summary: 'Editar reporte'})
    @ApiBody({type: PublicacionDto})
    @ApiOkResponse({description: 'Reporte editado correctamente'})
    @ApiUnauthorizedResponse({description: 'No autenticado',})
    @ApiForbiddenResponse({description: 'No puedes modificar este reporte',})
    @ApiNotFoundResponse({description: 'Reporte no encontrado',})
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
    @ApiOperation({summary: 'Eliminar una reporte'})
    @ApiOkResponse({description: 'Reporte eliminado correctamente'})
    @ApiUnauthorizedResponse({ description: 'No autenticado' })
    @ApiForbiddenResponse({ description: 'No puedes eliminar este reporte' })
    @ApiNotFoundResponse({ description: 'Reporte no encontrado' })
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
    @ApiOperation({summary: 'Actualizar estado de un reporte(solo admin)'})
    @ApiBody({type: UpdateEstadoDto,})
    @ApiOkResponse({description: 'Estado cambiado correctamente'})
    @ApiUnauthorizedResponse({ description: 'No autenticado' })
    @ApiForbiddenResponse({ description: 'No tienes permisos de administrador' })
    @ApiNotFoundResponse({ description: 'Reporte no encontrado' })
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