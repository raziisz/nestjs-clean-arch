import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdateUserUseCase } from '../../update-user.usecase';

describe('UpdateUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'anyid', name: 'new name' })).rejects.toThrow(
      new NotFoundError('UserModel not found using ID anyid'),
    );
  });

  it('should update a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });

    const output = await sut.execute({ id: entity.id, name: 'new name' });

    expect(output.name).toBe('new name');
  });
});