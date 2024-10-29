import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: ''.repeat(256) }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    });

    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = { ...UserDataBuilder({}), email: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: ''.repeat(256) }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'aninvalidemail' }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 25 as any }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    });

    it('Should throw an error when creating a user with invalid password', () => {
      let props: UserProps = { ...UserDataBuilder({}), password: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: ''.repeat(100) }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    });

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: UserProps = { ...UserDataBuilder({}), createdAt: '2023' as any };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), createdAt: 10 as any }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    });
  });
});
