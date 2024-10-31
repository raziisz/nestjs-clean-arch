import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UpdatePasswordUserUseCase } from '../application/usecases/update-password-user.usecase';
import { GetUserUseCase } from '../application/usecases/getuser.usecase ';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { SigninDto } from './dtos/signin.dto';
import { ListUsersDto } from './dtos/list-users.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {

  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdatePasswordUserUseCase.UseCase)
  private updatePasswordUserUseCase: UpdatePasswordUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Post()
  async create(@Body() signupDto: SignupDto) {
    return await this.signupUseCase.execute(signupDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    return await this.signinUseCase.execute(signinDto)
  }

  @Get()
  search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUseCase.execute({ id })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ ...updateUserDto, id  })
  }

  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() updataPasswordDto: UpdatePasswordDto) {
    return await this.updatePasswordUserUseCase.execute({ ...updataPasswordDto, id  })
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id })
  }
}
