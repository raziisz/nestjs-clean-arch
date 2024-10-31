import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository, private hashProvider: HashProvider) {}
    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;
      if (!email || !name || !password)
        throw new BadRequestError('Input data not provided');

      await this.userRepository.emailExists(email);
      const hashPassword = await this.hashProvider.generateHash(input.password);
      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword })
      );
      await this.userRepository.insert(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
