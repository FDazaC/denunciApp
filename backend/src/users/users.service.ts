import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
      
      // Devolvemos el usuario sin la contraseña
      const { password, ...result } = newUser;
      return result;
      
    } catch (error: any) {
      if (error.code === '23505') { // Código de error de PostgreSQL
        throw new ConflictException('El correo o RUT ya se encuentran registrados.');
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

 
  async findOneByEmail(email: string) {
    return this.userRepository.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') 
      .getOne();
  }

  findAll() {
    return this.userRepository.find({
      select: {id: true, nombre: true, email: true, rut: true, rol: true, createdAt: true} 
    });
  }
}