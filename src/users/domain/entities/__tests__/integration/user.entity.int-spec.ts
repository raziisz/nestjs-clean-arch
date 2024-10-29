import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), name: '' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), name: ''.repeat(256) };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), name: 10 as any };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = { ...UserDataBuilder({}), email: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), email: '' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), email: ''.repeat(256) };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), email: 'aninvalidemail' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), email: 25 as any };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid password', () => {
      let props: UserProps = { ...UserDataBuilder({}), password: null };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), password: '' };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), password: ''.repeat(100) };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), password: 10 as any };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        createdAt: '2023' as any,
      };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);

      props = { ...UserDataBuilder({}), createdAt: 10 as any };

      expect(() => new UserEntity(props)).toThrow(EntityValidationError);
    });

    it('Should a valid user', () => {
      expect.assertions(0);
      const props: UserProps = UserDataBuilder({});

      new UserEntity(props);
    });
  });

  describe('Update method', () => {
    it('Should throw an error when update a user with invalid name', () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => entity.update(null)).toThrow(EntityValidationError);
      expect(() => entity.update('')).toThrow(EntityValidationError);
      expect(() => entity.update(10 as any)).toThrow(EntityValidationError);
      expect(() => entity.update('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });

    it('Should a valid user', () => {
      expect.assertions(0);
      const entity = new UserEntity(UserDataBuilder({}));
      entity.update('other name');
    });
  });

  describe('UpdatePassword method', () => {
    it('Should throw an error when update a user with invalid password', () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => entity.updatePassword(null)).toThrow(EntityValidationError);
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError);
      expect(() => entity.updatePassword(10 as any)).toThrow(
        EntityValidationError,
      );
      expect(() => entity.updatePassword('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });

    it('Should a valid user', () => {
      expect.assertions(0);
      const entity = new UserEntity(UserDataBuilder({}));
      entity.updatePassword('other password');
    });
  });
});
