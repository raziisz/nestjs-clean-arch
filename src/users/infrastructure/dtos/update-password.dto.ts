import { UpdatePasswordUserUseCase } from '@/users/application/usecases/update-password-user.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUserUseCase.Input, 'id'>
{
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
