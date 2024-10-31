import { UpdatePasswordUserUseCase } from '@/users/application/usecases/update-password-user.usecase';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUserUseCase.Input, 'id'>
{
  password: string;
  oldPassword: string;
}
