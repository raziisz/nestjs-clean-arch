import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { GetUserUseCase } from '../../getuser.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';

describe('GetUserUseCase test unit', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository;
  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'anyid' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('Should be able to get user profile', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const items = [new UserEntity(UserDataBuilder({}))];

    repository.items = items;
    const result = await sut.execute({ id: items[0].id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    });
  });
});
