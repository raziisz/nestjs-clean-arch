import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { InvalidPasswordErrorFilter } from '../../invalid-password-error.filter';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidPasswordError('Invalid password error');
  }
}

describe('InvalidPasswordErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new InvalidPasswordErrorFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new InvalidPasswordErrorFilter()).toBeDefined();
  });

  it('should catch a InvalidPasswordError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Unprocessable Entity',
        message: 'Invalid password error',
      });
  });
});
