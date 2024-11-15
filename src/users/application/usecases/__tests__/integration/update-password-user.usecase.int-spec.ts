import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordUserUseCase } from '../../update-password-user.usecase';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUserUseCase.UseCase;
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
    sut = new UpdatePasswordUserUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'anyid',
        password: 'new password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('UserModel not found using ID anyid'));
  });

  it('should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    await expect(
      sut.execute({
        id: entity.id,
        password: 'new password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    );
  });

  it('should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    await expect(
      sut.execute({
        id: entity.id,
        password: '',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    );
  });

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('abc123');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    const output = await sut.execute({
      id: entity.id,
      password: '123abc',
      oldPassword: 'abc123',
    });

    const result = await hashProvider.compareHash('123abc', output.password);
    expect(result).toBeTruthy();
  });
});
