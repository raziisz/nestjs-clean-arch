import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignupDto } from '../../dtos/signup.dto';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SigninDto } from '../../dtos/signin.dto';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordUserUseCase } from '@/users/application/usecases/update-password-user.usecase';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';

describe('UsersController', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = '878f0e98-f9e4-4c90-8ae3-b840f539808f';
    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signupUseCase'] = mockSignupUseCase as any;
    const input: SignupDto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    };

    const result = await sut.create(input);
    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate a user', async () => {
    const output: SigninUseCase.Output = props;
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signinUseCase'] = mockSigninUseCase as any;
    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    };

    const result = await sut.login(input);
    expect(output).toMatchObject(result);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });
  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props;
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;
    const input: UpdateUserDto = {
      name: 'new name',
    };

    const result = await sut.update(id, input);
    expect(output).toMatchObject(result);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });
  it('should update a users password', async () => {
    const output: UpdatePasswordUserUseCase.Output = props;
    const mockUpdatePasswordUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['updatePasswordUserUseCase'] = mockUpdatePasswordUserUseCase as any;
    const input: UpdatePasswordDto = {
      password: 'new password',
      oldPassword: props.password
    };

    const result = await sut.updatePassword(id, input);
    expect(output).toMatchObject(result);
    expect(mockUpdatePasswordUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });
});
