import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository:
        Repository<User>,
    ) {}

    findByEmail(email: string) {
        return this.userRepository.findOne({
        where: { email },
        select:{
            id: true,
            nombre: true,
            email: true,
            rut: true,
            password: true,
            rol: true,
            createdAt: true,
        }
        });
    }

    findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
        });
    }

    create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async update(
        id: string,
        dto: UpdateUserDto,
    ) {
        await this.userRepository.update(
            id,
            dto,
        );

        return this.findById(id);
    }
}