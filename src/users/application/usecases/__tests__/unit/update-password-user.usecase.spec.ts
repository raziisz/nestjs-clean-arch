import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordUserUseCase } from '../../update-password-user.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUserUseCase test unit', () => {
  let sut: UpdatePasswordUserUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;
  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUserUseCase.UseCase(repository, hashProvider);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'anyid',
        password: 'new password',
        oldPassword: 'oldpassword',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throws error when password or oldpassword not provided', async () => {
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;
    await expect(() =>
      sut.execute({ id: items[0].id, password: '', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    );

    await expect(() =>
      sut.execute({
        id: items[0].id,
        password: 'anypassword',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    );

    await expect(() =>
      sut.execute({
        id: items[0].id,
        password: '',
        oldPassword: 'anyoldpassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    );
  });

  it('Should throws error when oldPassword no match with entity password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];
    repository.items = items;
    await expect(() =>
      sut.execute({
        id: items[0].id,
        password: '123545677',
        oldPassword: '123',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'));
  });

  it('Should update a password', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const hashPassword = await hashProvider.generateHash('1234');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];

    repository.items = items;
    const result = await sut.execute({
      id: items[0].id,
      password: '123789',
      oldPassword: '1234',
    });

    const checkNewPassword = await hashProvider.compareHash(
      '123789',
      result.password,
    );

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
