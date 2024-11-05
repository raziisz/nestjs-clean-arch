import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { SigninUseCase } from '../../signin.usecase';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
  let repository: UserPrismaRepository;
  let hashProvider: HashProvider;
  let module: TestingModule;
  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'new password',
      }),
    ).rejects.toThrow(new NotFoundError('UserModel not found using email a@a.com'));
  });
  it('should not be able to authenticate with wrong password', async () => {
    const oldPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword, email: 'a@a.com'}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fakepassword',

      }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: '',
        password: 'password',
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));
  });
  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'email@email.com',
        password: '',
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('123');
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com', password: hashPassword }));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    const output = await sut.execute({
      email: 'a@a.com',
      password: '123'
    });

    expect(output).toMatchObject(entity.toJSON())
  });
});
