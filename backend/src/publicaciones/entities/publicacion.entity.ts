import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToOne} from 'typeorm';
import { User } from '../../usuarios/entities/user.entity';

@Entity('publicaciones')
export class Publicacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 150,
    })
    titulo!: string;

    @Column({
        type: 'text',
    })
    descripcion!: string;

    @Column({
        nullable: true,
    })
    imagenUrl!: string;

    @Column({
        default: 'pendiente',
    })
    estado!: string;

    @Column({type: 'decimal',precision: 10,scale: 8})
    latitud!: number;

    @Column({type: 'decimal',precision: 11,scale: 8})
    longitud!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(
        () => User,(user) => user.publicaciones,{
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    usuario!: User;
}