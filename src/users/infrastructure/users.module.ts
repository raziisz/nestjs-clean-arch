import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { GetUserUseCase } from '../application/usecases/getuser.usecase ';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UpdatePasswordUserUseCase } from '../application/usecases/update-password-user.usecase';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useClass: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new SignupUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useClass: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new SigninUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useClass: GetUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository
      ) => new GetUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useClass: ListUsersUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository
      ) => new ListUsersUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useClass: UpdateUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository
      ) => new UpdateUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUserUseCase.UseCase,
      useClass: UpdatePasswordUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new UpdatePasswordUserUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useClass: DeleteUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,

      ) => new DeleteUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
