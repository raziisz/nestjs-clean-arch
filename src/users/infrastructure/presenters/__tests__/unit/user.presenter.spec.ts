import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter';
import { instanceToPlain } from 'class-transformer';

describe('UserPresenter unit tests', () => {
  const createdAt = new Date();
  let props = {
    id: '878f0e98-f9e4-4c90-8ae3-b840f539808f',
    name: 'Jhon Doe',
    email: 'a@a.com',
    password: '1234',
    createdAt,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });

  it('should presenter data', () => {
    const output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      id: '878f0e98-f9e4-4c90-8ae3-b840f539808f',
      name: 'Jhon Doe',
      email: 'a@a.com',
      createdAt: createdAt.toISOString(),
    });
  });
});

describe('UserCollectionPresenter unit tests', () => {
  const createdAt = new Date();
  let props = {
    id: '878f0e98-f9e4-4c90-8ae3-b840f539808f',
    name: 'Jhon Doe',
    email: 'a@a.com',
    password: '1234',
    createdAt,
  };
  describe('constructor', () => {
    it('should be defined', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new UserPresenter(props)]);
    });
  });

  it('should presenter data', () => {
    const sut = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });
    const output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      data: [
        {
          id: '878f0e98-f9e4-4c90-8ae3-b840f539808f',
          name: 'Jhon Doe',
          email: 'a@a.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    });
  });
});
