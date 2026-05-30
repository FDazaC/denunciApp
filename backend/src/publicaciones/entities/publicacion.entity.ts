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