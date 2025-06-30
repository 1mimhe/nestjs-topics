import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
// @Serialize(UserDto) => Applies to all handlers.
// @UseInterceptors(CurrentUserInterceptor) => Controller scoped interceptor
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  // Custom interceptor
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @ApiBody({ type: CreateUserDto }) // make the class properties visible manually
  @Serialize(UserDto)
  @ApiOperation({
    summary: 'Sign up a user',
    description: 'Creates a new user account with the provided information.'
  })
  @ApiCreatedResponse({
    type: UserDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'The email must be unique' 
  })
  @Post('/signup')
  async signup(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session = null;
    return true;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  // Using custom param decorator
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: any) {
    return user;
  }

  // Built-in Interceptors => ClassSerializerInterceptor, TimeoutInterceptor,...
  @UseInterceptors(ClassSerializerInterceptor) // Applies entity-based serialization rules 
  @Get('/:id')
  getUser(@Param('id') id: string) { // Path and Query params are always string.
    return this.usersService.findOne(+id);
  }

  // @ApiQuery({ name: 'role', enum: UserRole }) // isArray: true => Multiselect
  @Get()
  getUsers(@Query('email') email: string) {
    return this.usersService.find(email);
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
