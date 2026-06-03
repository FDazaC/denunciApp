import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate} from 'typeorm';
import * as bcrypt from 'bcrypt';

//Definición de roles
export enum UserRole{
    CIUDADANO = 'Ciudadano',
    ENCARGADO = 'Encargado',
    ADMIN = 'Administrador',
}

@Entity ('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    nombre: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true, length: 12})
    rut: string;

    @Column({select: false})
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CIUDADANO, //Todo usuario registrado por web se convierte en ciudadano
    })

    rol: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.password){
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }


}

