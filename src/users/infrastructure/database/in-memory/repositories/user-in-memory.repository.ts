import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository.contracts';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt'];

  findByEmail(email: string): Promise<UserEntity> {
    const entity = this.getEmail(email);
    if (!entity)
      throw new NotFoundError(`Entity not found using email ${email}`);

    return entity;
  }
  async emailExists(email: string): Promise<void> {
    const entity = this.getEmail(email);
    if (entity) throw new ConflictError('Email address already used');
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter | null,
  ): Promise<UserEntity[]> {
    if (!filter) return items;

    return items.filter(item => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort ? super.applySort(items, 'createdAt', 'desc') : super.applySort(items, sort, sortDir)

  }

  private async getEmail(email: string): Promise<UserEntity | null> {
    return this.items.find(item => item.email === email);
  }
}
