import { UserPresenter } from '../../user.presenter';
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
