import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { SigninUseCase } from '../../signin.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

describe('SigninUseCase test unit', () => {
  let sut: SigninUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;
  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(repository, hashProvider);
  });

  it('Should authenticate an user', async () => {
    const spyFindByemail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ password: hashPassword, email: 'a@a.com' }),
    );
    repository.items = [entity];

    const result = await sut.execute({ email: entity.email, password: '1234' });

    expect(spyFindByemail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should throws error when email not provided', async () => {
    const props = { email: null, password: '1234' };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when password not provided', async () => {
    const props = { email: 'a@a.com', password: null };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should not be able to authenticate with wrong email', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ password: hashPassword, email: 'a@a.com' }),
    );
    repository.items = [entity];
    const props = { email: 'a@a.com', password: 'fake' };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
