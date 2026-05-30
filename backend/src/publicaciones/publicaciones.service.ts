import {Injectable,BadRequestException,} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { memoryStorage } from 'multer';
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

    async uploadImage(file: Express.Multer.File) {
        if (!file) {throw new BadRequestException('No se envió archivo',);}
        const supabase = this.supabaseService.getClient();

        const fileName =
        `${Date.now()}-${file.originalname}`;

        const result = await supabase.storage
            .from(process.env.SUPABASE_BUCKET!)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
        });
        
        const{error}= result;
        if (error) {
        throw new BadRequestException(error.message);
        }

        const {
        data: { publicUrl },
        } = supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .getPublicUrl(fileName);

        return {
        url: publicUrl,
        };
    }

    async create(dto: PublicacionDto,user: any,) {

        const publicacion = this.publicacionesRepository.create({
                ...dto,
                usuario: {
                    id: user.sub,
                } as User,
            });

        return await this.publicacionesRepository.save(
            publicacion,
        );
    }
}