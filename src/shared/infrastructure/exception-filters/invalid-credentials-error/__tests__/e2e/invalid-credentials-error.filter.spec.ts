import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter';
import { TestingModule, Test } from '@nestjs/testing';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials');
  }
}

describe('InvalidCredentialsErrorFilter e2e', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new InvalidCredentialsErrorFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined();
  });

  it('should catch a InvalidCredentialsError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Invalid credentials',
      });
  });
});
