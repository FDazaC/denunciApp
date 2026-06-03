import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      
      
      const { password, ...result } = newUser;
      return result;
      
    } catch (error: any) {
      if (error.code === '23505') { // Código de error de PostgreSQL
        throw new ConflictException('El correo o RUT ya se encuentran registrados.');
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, select: {id: true, nombre: true, email: true, rut: true, rol: true, createdAt: true} });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
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