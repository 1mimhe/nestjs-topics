import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
// @Serialize(UserDto) => Applies to all handlers.
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Custom interceptor
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Serialize(UserDto)
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  // Built-in Interceptors => ClassSerializerInterceptor, TimeoutInterceptor,...
  @UseInterceptors(ClassSerializerInterceptor) // Applies entity-based serialization rules 
  @Get('/:id')
  getUser(@Param('id') id: string) { // Path and Query params are always string.
    return this.usersService.findOne(+id);
  }

  @Get()
  getUsers(@Query('email') email: string) {
    return this.usersService.findMany(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(+id);
  } 
}
