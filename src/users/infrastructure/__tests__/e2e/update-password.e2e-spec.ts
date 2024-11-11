import { UserRepository } from '@/users/domain/repositories/user.repository';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { UsersController } from '../../users.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  let hashProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();
    hashPassword = await hashProvider.generateHash('1234');
  });

  beforeEach(async () => {
    updatePasswordDto = {
      password: 'newpassword',
      oldPassword: 'oldpassword',
    };

    await prismaService.user.deleteMany();
    const hashPassword = await hashProvider.generateHash('oldpassword');
    entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await repository.insert(entity);

    const loginResponse = await request(app.getHttpServer())
      .post(`/users/login`)
      .send({ email: 'a@a.com', password: 'oldpassword' })
      .expect(HttpStatus.OK);

    accessToken = loginResponse.body.accessToken;
  });

  describe('PATCH /users/:id', () => {
    it('should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePasswordDto)
        .expect(HttpStatus.OK);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findById(res.body.data.id);
      const checkNewPassword = await hashProvider.compareHash(
        'newpassword',
        user.password,
      );

      expect(checkNewPassword).toBeTruthy();
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePasswordDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toBe('UserModel not found using ID fakeId');
    });

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete updatePasswordDto.password;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePasswordDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return a error with 422 code when the oldPassword field is invalid', async () => {
      delete updatePasswordDto.oldPassword;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePasswordDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should return a error with 422 code when password does not match', async () => {
      updatePasswordDto.oldPassword = 'fake';
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePasswordDto)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual('Old password does not match');
    });
  });
});
