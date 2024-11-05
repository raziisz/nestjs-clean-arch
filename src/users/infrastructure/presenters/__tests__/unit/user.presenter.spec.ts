import { UserOutput } from '@/users/application/dtos/user-output';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter unit tests', () => {
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
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  })
});
