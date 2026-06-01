import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Publicacion } from '../../publicaciones/entities/publicacion.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    @Column()
    nombre!: string;
    @Column({unique: true,})
    email!: string;
    @Column({unique: true,})
    rut!: string;
    @Column({select: false})
    password!: string;
    @Column({default: 'user'})
    rol!: string;
    @OneToMany(
        () => Publicacion,(publicacion) => publicacion.usuario,)
        publicaciones!: Publicacion[];
    @CreateDateColumn()
    createdAt!: Date;
}