import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { GetUserUseCase } from '../application/usecases/getuser.usecase';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UpdatePasswordUserUseCase } from '../application/usecases/update-password-user.usecase';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository';
import { AuthModule } from '@/auth/infrastructure/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) =>
        new UserPrismaRepository(prismaService),
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new SignupUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new SigninUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new GetUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new ListUsersUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new UpdateUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) => new UpdatePasswordUserUseCase.UseCase(userRepository, hashProvider),
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) =>
        new DeleteUserUseCase.UseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
