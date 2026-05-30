import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion } from './entities/publicacion.entity';

@Module({
    imports: [SupabaseModule, TypeOrmModule.forFeature([Publicacion])],
    controllers: [PublicacionesController],
    providers: [PublicacionesService],
})
export class PublicacionesModule {}