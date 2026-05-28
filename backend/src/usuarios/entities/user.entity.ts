import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from 'typeorm';

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
    @Column()
    password!: string;
    @CreateDateColumn()
    createdAt!: Date;
}