import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private configService: ConfigService) {}
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  getJwtExpiresInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXP_IN'));
  }

  getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
