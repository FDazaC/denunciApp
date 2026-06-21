import {Injectable,BadRequestException, NotFoundException, ForbiddenException} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Publicacion } from './entities/publicacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicacionDto } from './dto/publicacion.dto';
import { User } from '../usuarios/entities/user.entity';

@Injectable()
export class PublicacionesService {

    constructor(
        @InjectRepository(Publicacion)
        private publicacionesRepository: Repository<Publicacion>,
        private readonly supabaseService: SupabaseService,
    ) {}

    async uploadImage(file: any) {
        if (!file) {throw new BadRequestException('No se envió archivo');}
        const supabase = this.supabaseService.getClient();

        const fileName = `${Date.now()}-${file.originalname}`;

        const result = await supabase.storage
            .from(process.env.SUPABASE_BUCKET!)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
        });
        
        const { error } = result;
        if (error) {
            throw new BadRequestException(error.message);
        }

        const {
            data: { publicUrl },
        } = supabase.storage
            .from(process.env.SUPABASE_BUCKET!)
            .getPublicUrl(fileName);

        return { url: publicUrl };
    }

    async create(dto: PublicacionDto, user: any) {
        const publicacion = this.publicacionesRepository.create({
            ...dto,
            usuario: { id: user.sub } as User,
        });

        return await this.publicacionesRepository.save(publicacion);
    }

    async findAll() {
        return await this.publicacionesRepository.find({
            relations: ['usuario'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        const publicacion = await this.publicacionesRepository.findOne({
            where: { id },
            relations: ['usuario'], // <-- CRÍTICO: sin esto, publicacion.usuario es undefined
        });

        if (!publicacion) {
            throw new NotFoundException('Publicacion no encontrada');
        }

        return publicacion;
    }

    async update(id: number, dto: PublicacionDto, user: any) {
        const publicacion = await this.findOne(id);

        if (String(publicacion.usuario.id) !== String(user.sub)) {
            throw new ForbiddenException('No puedes modificar este reporte');
        }

        await this.publicacionesRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number, user: any) {
        const publicacion = await this.findOne(id);
        const esAdmin = user.rol === 'admin';
        const esDuenio = String(publicacion.usuario.id) === String(user.sub);

        if (!esAdmin && !esDuenio) {
            throw new ForbiddenException('No puedes eliminar esta publicación');
        }

        if (publicacion.imagenUrl) {
            const supabase = this.supabaseService.getClient();
            const fileName = publicacion.imagenUrl.split('/').pop();
            if (fileName) {
                await supabase.storage.from(process.env.SUPABASE_BUCKET!).remove([fileName]);
            }
        }

        await this.publicacionesRepository.remove(publicacion);
        return { message: 'Reporte Eliminado' };
    }

    async misReportes(userId: string) {
        return await this.publicacionesRepository.find({
            where: { usuario: { id: userId } },
            relations: ['usuario'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateEstado(id: number, estado: string, user: any) {
        if (user.rol !== 'admin') {
            throw new ForbiddenException('Acceso no autorizado');
        }

        const publicacion = await this.findOne(id);
        publicacion.estado = estado;

        return await this.publicacionesRepository.save(publicacion);
    }
}