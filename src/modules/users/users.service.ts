import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository /*, FindOneOptions */ } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create.user.dto';
import { validate } from 'class-validator';
import { HTTP_STATUS_MESSAGES } from 'src/shared/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | string> {
    try {
      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        throw new BadRequestException('Validation failed');
      }
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException(HTTP_STATUS_MESSAGES.DUPLICATED_EMAIL);
      }
      const newUser = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(newUser);
      return HTTP_STATUS_MESSAGES.USER_CREATED_SUCCESS;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new Error(HTTP_STATUS_MESSAGES.ERROR_UNKNOWN);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /* async findOne(id: number): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    return this.usersRepository.findOne(options);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }*/

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
