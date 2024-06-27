import { Body, Controller, Get, /*Param,*/ Post } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './create.user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  create(@Body() createUserDto: CreateUserDto): Promise<User | string> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/findAll')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /*@Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }*/
}
