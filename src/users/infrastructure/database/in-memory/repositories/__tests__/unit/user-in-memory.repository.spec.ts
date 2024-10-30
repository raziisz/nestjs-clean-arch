import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserRepository.Repository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('Should throw error when not found - findByEmail method', async () => {
    const email = 'a@a.com';
    await expect(sut.findByEmail(email)).rejects.toThrow(
      new NotFoundError(`Entity not found using email ${email}`),
    );
  });

  it('Should find entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByEmail(entity.email);
    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });

  it('Should throw error when found - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError(`Email address already used`),
    );
  });

  it('Should find a entity by email - emailExists method', async () => {
    expect.assertions(0);
    await sut.emailExists('anyemail@anydomain.com');
  });
});
