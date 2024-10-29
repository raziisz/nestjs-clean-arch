import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepository
{
  findByEmail(email: string): Promise<UserEntity>  {
    const entity = this.getEmail(email);
    if (!entity) throw new NotFoundError(`Entity not found using email ${email}`);

    return entity;
  }
  async emailExists(email: string): Promise<void> {
    const entity = this.getEmail(email);
    if (entity) throw new ConflictError('Email address already used');
  }

  private async getEmail(email: string): Promise<UserEntity | null> {
    return this.items.find(item => item.email === email);
  }
}
